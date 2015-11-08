'use strict';

var express = require('express');
var config = require('./lib/config');
var debug = require('debug')('gitmatch');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var bodyParser = require('body-parser');
var RedisStore = require('connect-redis')(session);
var routes = require('./routes/index');

var app = express();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

if (app.get('env') === 'development') {}

app.use(session({
  store: new RedisStore({
    url: config.redis.url
  }),
  secret: 'Kn0ck0ut',
  resave: false,
  cookie: {
    maxAge: 2628000000
  },
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new GithubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
}, function(accessToken, refreshToken, profile, done) {
  done(null, {
    accessToken: accessToken,
    profile: profile
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(function(req, res, next) {
  console.log(req.user.accessToken);
  next();
});

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/home');
  } else {
    res.render('index');
  }
});

/* GET starts OAuth authorisation with Github */
app.get('/auth', passport.authenticate('github', {
  scope: ['user', 'public_repo'],
  state: 'we got you covered'
}));

/* GET authorisation error page. */
app.get('/auth/error', function(req, res) {
  res.render('loginko');
});

/* GET OAuth authorisation callback */
app.get('/auth/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/error'
  }),
  function(req, res) {
    res.redirect('/home');
  }
);

/* GET Logout */
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* GET about page. */
app.get('/about', function(req, res) {
  res.render('about');
});

app.use('/', ensureAuthenticated, routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    debug(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);
server.listen(config.port);
server.on('error', function(error) {
  console.log(error);
});

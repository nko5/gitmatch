'use strict';

var express = require('express');
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
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var client = redis.createClient(
  'redis://x:1f9846ff17b44925bd0f177c401e54a2@crafty-willow-8972.redisgreen.net:11042/',
  {}
);

var routes = require('./routes/index');

var app = express();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
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
    url: 'redis://x:1f9846ff17b44925bd0f177c401e54a2@crafty-willow-8972.redisgreen.net:11042/'
  }),
  secret: 'Kn0ck0ut',
  resave: false,
  cookie: { maxAge: 2628000000 },
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new GithubStrategy({
  clientID: 'a9f50e631bc7bd2f8f7c',
  clientSecret: 'd0315b0f9dd644318c852cdf1d384f35ecb3766b',
  callbackURL: 'http://localhost:3000/auth/callback'
}, function(accessToken, refreshToken, profile, done){
  done(null, {
    accessToken: accessToken,
    profile: profile
  });
}));

passport.serializeUser(function(user, done) {
  done(null, {
    user: 'afinto'
  });
});

passport.deserializeUser(function(id, done) {
  done(null, {
    user: 'afinto'
  });
});

app.use('/', routes);

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
server.listen(3000);
server.on('error', function(error) {
  console.log(error);
});

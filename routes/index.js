'use strict';

var express = require('express');
var passport = require('passport');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index');
});

/* GET starts OAuth authorisation with Github */
router.get('/auth', passport.authenticate('github'));

/* GET authorisation error page. */
router.get('/auth/error', function(req, res) {
  // TODO Create login KO template
  res.render('loginko');
});

/* GET OAuth authorisation callback */
router.get('/auth/callback',
  passport.authenticate('github', {failureRedirect: '/auth/error'}),
  function(req, res) {
    // TODO Redirect to /home
    res.redirect('/home');
  }
);

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});

/* GET Logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/* GET fech all repos for the logged user */
router.get('/home', function(req, res, next) {
  var reposUrl = req.user.profile._json.repos_url;
  var context = {
    user: req.user
  };
  request.get(
    {
      url: reposUrl,
      headers: {
        'User-Agent': 'request'
      },
      json: true
    }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      context.repos = body;
      res.render("home", context);
    }
  });
});

/* GET checks the information for a repo */
router.get('/check/:repo', function(req, res, next) {
  var username = req.user.profile.username;
  var reponame = req.params.repo;
  var repoUrl = 'https://api.github.com/repos/'+username+'/'+reponame ;
  var context = {
    user: req.user
  };
  request.get(
    {
      url: repoUrl,
      headers: {
        'User-Agent': 'request'
      },
      json: true
    }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      context.repo = body;
      res.send(context);
    }
  });
});

module.exports = router;

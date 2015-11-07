'use strict';

var express = require('express');
var passport = require('passport');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET starts OAuth authorisation with Github */
router.get('/auth', passport.authenticate('github'));

/* GET authorisation error page. */
router.get('/auth/error', function(req, res) {
  // TODO Create login KO template
  res.send('Login Failed');
});

/* GET OAuth authorisation callback */
router.get('/auth/callback',
  passport.authenticate('github', {failureRedirect: '/auth/error'}),
  function(req, res) {
    // TODO Redirect to /home
    res.send('Login success');
  }
);

/* GET fech all repos for the logged user */
router.get('/home', function(req, res, next) {
  var repos_url = req.user.profile._json.repos_url;
  console.log(repos_url);
  request.get(
    {
      url: repos_url,
      headers: {
        'User-Agent': 'request'
      }
    }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // TODO Render home with repos
      res.send(body);
    }
  });
});

module.exports = router;

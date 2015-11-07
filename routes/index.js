'use strict';

var express = require('express');
var passport = require('passport');
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

module.exports = router;

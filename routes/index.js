'use strict';

var express = require('express');
var repository = require('../lib/repository');
var search = require('../lib/search');

var router = express.Router();

/* GET fech all repos for the logged user */
router.get('/home', function(req, res) {
  repository.getUserRepos(req.user.accessToken)
    .then(function(resolved) {
      var context = {};
      context.repos = resolved;
      res.render('home', context);
    }, function(rejected) {
      context.error = rejected;
      res.render('home', context);
    });
});

/* GET checks the information for a repo */
router.get('/check/:repo', function(req, res) {
  var context = {};
  var repoName = req.params.repo;
  var user = req.user.profile.username;
  context.user = req.user;

  repository.getRepo(user, repoName, req.user.accessToken)
    .then(function(repo) {
      context.repo = repo;
      repository.checkRepo(repo, req.user.accessToken)
        .then(function(result) {
          if (result.hasIssues) {
            context.hasIssues = true;
          }
          if (result.hasContribuingMd) {
            context.hasContribuingMd = true;
          }
          if (result.hasPackageJson) {
            context.hasPackageJson = true;
          }
          res.render('summary', context);
        });
    });
});

/* GET repo is valid so match process starts */
router.get('/match/:repo', function(req, res) {
  // TODO
  // var username = req.user.profile.username;
  // var reponame = req.params.repo;
  // var context = {
  //   user: req.user
  // };
  // res.render('match', context);
});

module.exports = router;

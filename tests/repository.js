var test = require('tape');
var repository = require('../lib/repository');
var nock = require('nock');

var badRepo = require('./data/repository_notready');
var issuedRepo = require('./data/repo_with_issues');
var goodRepo = require('./data/repository');
var repoWithMissingPackage = require('./data/repo_with_missing_package');
var repoPackageJson = require('./data/package');

// nock.recorder.rec();
nock('https://api.github.com:443')
  .get('/repos/PatrickHeneise/Gandalf')
  .reply(200, badRepo)
  .get('/repos/PatrickHeneise/Gandalf/contents/package.json')
  .reply(200, repoPackageJson)
  .get('/repos/PatrickHeneise/Gandalf/contents/CONTRIBUTING.md')
  .reply(404, {
    'message': 'Not Found',
    'documentation_url': 'https://developer.github.com/v3'
  })
  .get('/repos/dscape/nano/contents/CONTRIBUTING.md')
  .reply(200)
  .get('/repos/ruby/ruby/contents/package.json')
  .reply(404, {
    'message': 'Not Found',
    'documentation_url': 'https://developer.github.com/v3'
  });

test('Repo get', function(t) {
  t.plan(1);

  repository.getRepo('PatrickHeneise', 'Gandalf')
    .then(function(response) {
      t.equal(response.name, 'Gandalf');
    }, function(error) {
      t.end(error);
    });
});

test('Repo has not enough issues', function(t) {
  t.plan(1);

  repository.hasIssues(badRepo)
    .then(function() {}, function(error) {
      t.equal(error, 'not enough issues');
    });
});

test('Repo has sufficient issues', function(t) {
  t.plan(1);

  repository.hasIssues(goodRepo)
    .then(function(response) {
      t.equal(response, 'issues ok');
    }, function(error) {
      t.end(error);
    });
});

test('Repo get package.json', function(t) {
  t.plan(2);

  repository.getPackageJson(badRepo)
    .then(function(response) {
      t.equal(typeof response, 'object');
      t.equal(response.name, 'Gandalf');
    }, function(error) {
      t.end(error);
    });
});

test('Repo CONTRIBUTING.md does not exist', function(t) {
  t.plan(1);

  repository.checkContributingmd(badRepo)
    .then(function() {}, function(error) {
      t.equal(error, 'CONTRIBUTING.md not found');
    });
});

test('Repo CONTRIBUTING.md exists', function(t) {
  t.plan(1);

  repository.checkContributingmd(goodRepo)
    .then(function(response) {
      t.equal(response, 'CONTRIBUTING.md ok');
    }, function(error) {
      t.end(error);
    });
});

test('Repo Check #1: Missing Issues', function(t) {
  t.plan(1);

  repository.checkRepo(badRepo)
    .then(function() {}, function(error) {
      t.equal(error, 'not enough issues');
    });
});

test('Repo Check #2: Missing CONTRIBUTING.md', function(t) {
  t.plan(1);

  repository.checkRepo(issuedRepo)
    .then(function() {}, function(error) {
      t.equal(error, 'CONTRIBUTING.md not found');
    });
});

test('Repo Check #3: Missing package.json', function(t) {
  t.plan(1);

  repository.checkRepo(repoWithMissingPackage)
    .then(function() {}, function(error) {
      t.equal(error, 'CONTRIBUTING.md not found');
    });
});

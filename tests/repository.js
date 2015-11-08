var test = require('tape');
var repository = require('../lib/repository');

var badRepo = require('./data/repository_notready');
var goodRepo = require('./data/repository');

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
    .then(function(response) {}, function(error) {
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

test('Repo Check #1: Missing CONTRIBUTING.md', function(t) {
  t.plan(1);

  repository.checkRepo(badRepo)
    .then(function(response) {
    }, function(error) {
      console.log(error);
      t.end(error);
    });
});

test('Repo CONTRIBUTING.md does not exist', function(t) {
  t.plan(1);

  repository.checkContributingmd(badRepo)
    .then(function(response) {}, function(error) {
      t.equal(error, 'contributing.md not found');
    });
});

test('Repo CONTRIBUTING.md exists', function(t) {
  t.plan(1);

  repository.checkContributingmd(goodRepo)
    .then(function(response) {
      t.equal(response, 'contributing ok');
    }, function(error) {
      t.end(error);
    });
});

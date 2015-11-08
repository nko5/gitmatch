var test = require('tape');
var repository = require('../lib/repository');
var nock = require('nock');

var badRepo = require('./data/repository_notready');
var issuedRepo = require('./data/repo_with_issues');
var goodRepo = require('./data/repository');
var repoWithMissingPackage = require('./data/repo_with_missing_package');
var repoPackageJson = require('./data/package');
var userRepos = require('./data/userRepos');

// nock.recorder.rec();
nock('https://api.github.com:443')
  .get('/user/repos')
  .query({
    'type': 'public',
    'per_page': 100
  })
  .reply(200, userRepos)
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
  })
  .post('/repos/PatrickHeneise/gitup-testing/issues', {
    'title': 'Contributor wanted!',
    'body': 'Dear @Moezalez,\n\n@PatrickHeneise matched you on [GitMatch](http://barcelonajs.2015.nodeknockout.com)!\n\nWith GitMatch we analysed your code style and NPM module usage and you have a great match score with this repository.\n\nThis repository is open source and meets all the requirements to be [contribution-friendly](https://github.com/PatrickHeneise/gitup-testing/blob/master/CONTRIBUTING.md).\n\nPlease have a look at the open [issues](https://github.com/PatrickHeneise/gitup-testing/issues) to see if there\'s something you could help with, @PatrickHeneise would greatly appreciate your contribution.\n\nRegards,\nGitMatch',
    'labels': ['help wanted', 'gitmatch']
  })
  .reply(201);

test('getUserRepos', function(t) {
  t.plan(1);

  repository.getUserRepos()
    .then(function(response) {
      t.equal(response.length, 30);
    }, function(error) {
      t.end(error);
    });
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
    .then(function(resolved) {
      t.equal(resolved.hasIssues, false);
    });
});

test('Repo Check #2: Missing CONTRIBUTING.md', function(t) {
  t.plan(1);

  repository.checkRepo(issuedRepo)
    .then(function(resolved) {
      t.equal(resolved.hasContribuingMd, false);
    });
});

test('Repo Check #3: Missing package.json', function(t) {
  t.plan(1);

  repository.checkRepo(repoWithMissingPackage)
    .then(function(resolved) {
      t.equal(resolved.hasPackageJson, false);
    });
});

test('matchMade', function(t) {
  t.plan(1);

  repository.matchMade('PatrickHeneise', 'gitup-testing', 'Moezalez')
    .then(function(resolved) {
      t.equal(resolved, 'ok');
    }, function(rejected) {
      t.end(rejected);
    });
});

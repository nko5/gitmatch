var config = require('./config');
var fs = require('fs');
var path = require('path');
var redis = require('redis');
var GitHubApi = require('github');
var repository = {};

var github = new GitHubApi({
  // required
  version: '3.0.0',
  // optional
  protocol: 'https',
  host: 'api.github.com',
  timeout: 5000,
  headers: {
    'user-agent': 'BarcelonaJS'
  }
});

if (process.env.NODE_ENV === 'development') {
  github.debug = true;
}

repository.getUserRepos = function(accessToken) {
  return new Promise(function(resolve, reject) {
    if (accessToken) {
      github.authenticate({
        type: 'oauth',
        token: accessToken
      });
    }
    github.repos.getAll({
      type: 'public',
      per_page: 100
    }, function(error, repos) {
      if (error) {
        reject('repo error');
      } else {
        resolve(repos);
      }
    });
  });
};

repository.getRepo = function(userName, repoName, accessToken) {
  return new Promise(function(resolve, reject) {
    if (accessToken) {
      github.authenticate({
        type: 'oauth',
        token: accessToken
      });
    }
    github.repos.get({
      user: userName,
      repo: repoName
    }, function(error, liveRepo) {
      if (!liveRepo) {
        reject('repo error');
      } else {
        delete liveRepo.meta;
        resolve(liveRepo);
      }
    });
  });
};

repository.hasIssues = function(repo) {
  return new Promise(function(resolve, reject) {
    if (repo.open_issues_count < config.requirements.minimum_git_issues) {
      reject('not enough issues');
    } else {
      resolve('issues ok');
    }
  });
};

repository.getPackageJson = function(repo, accessToken) {
  return new Promise(function(resolve, reject) {
    var client = redis.createClient(
      config.redis.url, {}
    );
    client.get('package:' + repo.full_name, function(error, cachedRepo) {
      if (!error && cachedRepo) {
        var repoJson = JSON.parse(cachedRepo);
        client.quit();
        resolve(repoJson);
      } else {
        if (accessToken) {
          github.authenticate({
            type: 'oauth',
            token: accessToken
          });
        }
        github.repos.getContent({
          user: repo.owner.login,
          repo: repo.name,
          path: 'package.json'
        }, function(error, packageJson) {
          if (error) {
            client.quit();
            reject('package.json not found');
          } else {
            var body = new Buffer(packageJson.content, packageJson.encoding);
            client.set('package:' + packageJson.full_name, body.toString('utf8'), function() {
              client.quit();
              resolve(JSON.parse(body.toString('utf8')));
            });
          }
        });
      }
    });
  });
};

repository.checkContributingmd = function(repo, accessToken) {
  return new Promise(function(resolve, reject) {
    if (!repo) {
      reject('empty');
    }

    if (accessToken) {
      github.authenticate({
        type: 'oauth',
        token: accessToken
      });
    }

    github.repos.getContent({
      user: repo.owner.login,
      repo: repo.name,
      path: 'CONTRIBUTING.md'
    }, function(error) {
      if (error) {
        reject('CONTRIBUTING.md not found');
      } else {
        resolve('CONTRIBUTING.md ok');
      }
    });
  });
};

repository.createContributingmd = function(user, repo, accessToken) {
  return new Promise(function(resolve, reject) {
    var file = fs.readFileSync(path.join(process.env.PWD, 'data', 'CONTRIBUTING.md'));

    if (accessToken) {
      github.authenticate({
        type: 'oauth',
        token: accessToken
      });
    }

    var fileContent = file.toString('utf8');
    fileContent = fileContent.replace('{{repo}}', user + '/' + repo);
    var writeFile = new Buffer(fileContent, 'utf8');

    github.repos.createContent({
      user: user,
      repo: repo,
      path: 'CONTRIBUTING.md',
      content: writeFile.toString('base64'),
      message: 'Created CONTRIBUTING.md'
    }, function(error) {
      if (error) {
        reject(error);
      }
      resolve('CONTRIBUTING.md ok');
    });
  });
};

repository.checkRepo = function(repo, accessToken) {
  return new Promise(function(resolve) {
    var result = {};
    var hasIssues = repository.hasIssues(repo, accessToken);
    var hasContribuingMd = repository.checkContributingmd(repo, accessToken);
    var hasPackageJson = repository.getPackageJson(repo, accessToken);

    Promise.all([hasIssues, hasContribuingMd, hasPackageJson])
      .then(function() {
        result = {
          hasContribuingMd: true,
          hasIssues: true,
          hasPackageJson: true
        };
        resolve(result);
      }, function(rejected) {
        if (rejected === 'not enough issues') {
          result.hasIssues = false;
          hasContribuingMd.then(function() {
            result.hasContribuingMd = true;
            hasPackageJson.then(function() {
              result.hasPackageJson = true;
              resolve(result);
            }, function() {
              result.hasPackageJson = false;
              resolve(result);
            });
          }, function() {
            result.hasContribuingMd = false;
            hasPackageJson.then(function() {
              result.hasPackageJson = true;
              resolve(result);
            }, function() {
              result.hasPackageJson = false;
              resolve(result);
            });
          });
        } else if (rejected === 'CONTRIBUTING.md not found') {
          result.hasContribuingMd = false;
          hasIssues.then(function() {
            result.hasIssues = true;
            hasPackageJson.then(function() {
              result.hasPackageJson = true;
              resolve(result);
            }, function() {
              result.hasPackageJson = false;
              resolve(result);
            });
          }, function() {
            result.hasIssues = false;
            hasPackageJson.then(function() {
              result.hasPackageJson = true;
              resolve(result);
            }, function() {
              result.hasPackageJson = false;
              resolve(result);
            });
          });
        } else {
          resolve(result);
        }
      });
  });
};

module.exports = exports = repository;

var config = require('./config');
var request = require('request');
var redis = require('redis');
var GitHubApi = require('github');
var repository = {};

var github = new GitHubApi({
  // required
  version: '3.0.0',
  // optional
  debug: true,
  protocol: 'https',
  host: 'api.github.com',
  timeout: 5000,
  headers: {
      'user-agent': 'BarcelonaJS' // GitHub is happy with a unique user agent
  }
});

repository.getRepo = function(user, repo) {
  return new Promise(function(resolve, reject) {
    var client = redis.createClient(
      config.redis.url, {}
    );
    client.get('repo:' + user + ':' + repo, function (error, cachedRepo) {
      if (!error && cachedRepo) {
        var repoJson = JSON.parse(cachedRepo);
        client.quit();
        resolve(repoJson);
      } else {
        github.repos.get({
          user: user,
          repo: repo
        }, function (error, liveRepo) {
          if (!liveRepo) {
            client.quit();
            reject('json error');
          } else {
            delete liveRepo.meta;
            client.set('repo:' + user + ':' + repo, JSON.stringify(liveRepo), function () {
              client.quit();
              resolve(liveRepo);
            });
          }
        });
      }
    });
  });
};

repository.getPackageJson = function(repo) {
  return new Promise(function(resolve, reject) {
    var client = redis.createClient(
      config.redis.url, {}
    );
    var url = repo.contents_url.replace('{+path}', 'package.json?ref=master');
    client.get('package:' + url, function (error, cachedRepo) {
      if (!error && cachedRepo) {
        var repoJson = JSON.parse(cachedRepo);
        client.quit();
        resolve(repoJson);
      } else {
        var content = '';
        var headers = {
          'User-Agent': 'BarcelonaJS'
        };

        var options = {
          uri: url,
          method: 'GET',
          headers: headers
        };

        if (!repo) {
          client.quit();
          reject('empty');
        }

        request(options)
        .on('response', function (response) {
          if (response.statusCode === 404) {
            client.quit();
            reject('not found');
          }
        })
        .on('data', function(chunk) {
          content += chunk;
        })
        .on('end', function() {
          var content_json;
          content = content.toString('utf8');

          try {
            content_json = JSON.parse(content);
          } catch (e) {
            client.quit();
            reject(e);
          }

          if (!content_json) {
            client.quit();
            reject('json error');
          } else {
            var body = new Buffer(content_json.content, content_json.encoding);
            client.set('package:' + content_json.url, body.toString('utf8'), function () {
              client.quit();
              resolve(JSON.parse(body.toString('utf8')));
            });
          }
        });
      }
    });
  });
};

repository.checkContributingmd = function(repo) {
  return new Promise(function(resolve, reject) {
    if (!repo) {
      reject('empty');
    }

    var url = repo.contents_url.replace('{+path}', 'CONTRIBUTING.md?ref=master');
    var headers = {
      'User-Agent': 'BarcelonaJS'
    };

    var options = {
      uri: url,
      method: 'GET',
      headers: headers
    };

    request(options)
    .on('response', function (response) {
      if (response.statusCode === 404) {
        reject('not found');
      } else {
        resolve('ok');
      }
    });
  });
};

repository.createContributingmd = function(req, repo) {
  return new Promise(function(resolve, reject) {
    console.log(req.user);
    github.authenticate({
      type: 'oauth',
      token: req.user.session.token
    });
  });
};

repository.checkRepo = function(repo) {
  return new Promise(function(resolve, reject) {
    repository.checkContributingmd(repo).then(function(result) {

    });
    repository.getPackageJson(repo).then(function(package) {

    });
  });
};

module.exports = exports = repository;

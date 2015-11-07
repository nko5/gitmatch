var config = require('./config');
var request = require('request');
var redis = require('redis');
var client = redis.createClient(
  config.redis.url, {}
);
var repository = {};

repository.getPackageJson = function(repo) {
  return new Promise(function(resolve, reject) {
    var url = repo.contents_url.replace('{+path}', 'package.json?ref=master');
    client.get('package:' + url, function (error, cachedRepo) {
      if (!error && cachedRepo) {
        repoJson = JSON.parse(cachedRepo);
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
          reject('empty');
        }

        request(options)
        .on('response', function (response) {
          if (response.statusCode === 404) {
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
            reject(e);
          }

          if (!content_json) {
            reject('json error');
          } else {
            var body = new Buffer(content_json.content, content_json.encoding);
            client.set('package:' + content_json.url, body.toString('utf8'), function () {
              resolve(JSON.parse(body.toString('utf8')));
            });
          }
        });
      }
    });
  });
};

module.exports = exports = repository;

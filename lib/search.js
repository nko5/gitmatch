var request = require('request');
var redis = require('redis');
var config = require('./config');

var search = {};

search.users = function(requesterName, location) {
  return new Promise(function(resolve, reject) {
    if(!requesterName || !location){
      reject('Cannot search without language or location');
      return;
    }
    var queryString = {
      q: 'language:' + config.search.language + ' ' +
      'location:' + location + ' ' +
      'repos:1..10'
    };

    var headers = {
      'User-Agent': 'BarcelonaJS'
    };

    var options = {
      uri: 'https://api.github.com/search/users',
      method: 'GET',
      qs: queryString,
      headers: headers
    };

    request(options, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        var client = redis.createClient(
          config.redis.url, {}
        );
        var key = 'github:' + requesterName;
        var developers = JSON.parse(body).items;
        client.lpush(key, JSON.stringify(developers), function (err, replies) {
          resolve(key);
        });
      }
    });
  });
};

search.repos = function(username) {
  return new Promise(function(resolve, reject) {

    var headers = {
      'User-Agent': 'BarcelonaJS'
    };

    var options = {
      uri: 'https://api.github.com/users/' + username + '/repos',
      method: 'GET',
      headers: headers
    };

    request(options, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};

module.exports = exports = search;

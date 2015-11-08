var request = require('request');
var config = require('./config');

var search = {};

search.users = function(location) {
  return new Promise(function(resolve, reject) {
    if(!location){
      reject(new Error('location is not defined'));
    }
    var queryString = {
      q: 'language:' + config.search.language + ' ' +
      'location:' + location + ' ' +
      'repos:3..10'
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

    request(options, function (error, response, body) {
      if(error){
        reject(error);
      } else {
        var users = JSON.parse(body).items.map(function(user) {
          return {
            login: user.login,
            url: user.url,
            repos: user.repos_url
          };
        });
        resolve(users);
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

    request(options, function (error, response, body) {
      if(error){
        reject(error);
      } else {
        var repoLinks = JSON.parse(body).slice(0, 3).map((repo) => repo.html_url);
        resolve(JSON.parse(body));
      }
    });
  });
};

module.exports = exports = search;

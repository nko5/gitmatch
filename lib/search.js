var request = require('request');

var search = {};

search.users = function(language, location) {
  return new Promise(function(resolve, reject) {
    var queryString = {
      q: 'language:' + language + ' ' +
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

    request(options, function (error, response, body) {
      if(error){
        reject(error);
      } else {
        resolve(JSON.parse(body).items);
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
        resolve(JSON.parse(body));
      }
    });
  });
};

module.exports = exports = search;

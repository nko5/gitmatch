var request = require('request');

var search = {};

search.users = function(language, location, callback) {

  var queryString = {
    q: 'language:' + language + ' ' + 'location:' + location
  };

  var headers = {
    'User-Agent': 'BarcelonaJS'
  };

  var options = {
    uri: 'https://api.github.com/search/users?q=',
    method: 'GET',
    qs: queryString,
    headers: headers
  };

  request(options, function (error, response, body) {
    callback(error, JSON.parse(body));
  });
};

module.exports = exports = search;

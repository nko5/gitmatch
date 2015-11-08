var request = require('request');
var config = require('./config');
var GitHubApi = require('github');

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



var search = function(){

  var queryDevs = function(location) {
    return new Promise(function(resolve, reject) {
      if(!location){
        reject(new Error('location is not defined'));
      }

      var queryString = 'language:' + config.search.language + ' ' +
        'location:' + location + ' ' +
        'repos:3..10';

      github.search.users({q: queryString}, function(error, data) {
          if(error){
            reject(error);
          } else {
            var users = data.items.map((user) => {
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


  var queryRepo = function(username) {
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
          console.log(JSON.parse(body));
          var repoLinks = JSON.parse(body).slice(0, 3).map((repo) => repo.html_url);
          resolve(repoLinks);
        }
      });
    });
  };


  var getDevRepos = function(devs){

    var promiseList = [];
    devs.forEach(function(dev){
      var promise = queryRepo(dev.login).then(function(repoLinks){
        dev.repos = repoLinks;
      });
      promiseList.push(promise);
    });

    return Promise.all(promiseList);
  };


  var saveDevsToRedis = function(devs){
    console.log(devs);
  } ;


  var saveDevelopers = function(username, location, accessToken) {

    if (accessToken) {
      github.authenticate({
        type: 'oauth',
        token: '0fe578a4b1f4b4aa68957697f4d32f2bd6052f7e'
      });
    }

    return queryDevs(location)
      .then(getDevRepos)
      .then(saveDevsToRedis);
  };

  return {
    searchAndSaveDevs: saveDevelopers
  };

};


module.exports = exports = search();

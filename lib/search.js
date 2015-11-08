var config = require('./config');
var GitHubApi = require('github');
var redis = require('redis');


var client;


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

      github.repos.getFromUser({user: username}, function(error, data) {
          if(error){
            reject(error);
          } else {
            var repos = data.slice(0, 3).map(function(repo){
              github.repos.getContent({
                user: repo.owner.login,
                repo: repo.name,
                path: 'package.json'
              }, function(error, packageJson) {
                if (error) {
                  return null;
                } else {
                  new Buffer(packageJson.content, packageJson.encoding).toString('utf8');
                }
              });
            });
            resolve(repos);
          }
      });
    });
  };


  var getDevRepos = function(devs){

    var promiseList = [];
    devs.forEach(function(dev){
      var promise = queryRepo(dev.login).then(function(repoLinks){
        dev.repos = repoLinks;
        return dev;
      });
      promiseList.push(promise);
    });

    return Promise.all(promiseList);
  };


  var saveDevelopers = function(username, location, accessToken) {

    if (!accessToken) {
      github.authenticate({
        type: 'oauth',
        token: '0fe578a4b1f4b4aa68957697f4d32f2bd6052f7e'
      });
    }

    client = redis.createClient(
     config.redis.url, {}
   );

    return queryDevs(location)
      .then(getDevRepos)
      .then(function(devs){
        devs.forEach(function(dev){
          return new Promise(function(resolve, reject) {
            var key = 'github:' + username;
            client.lpush('github:' + username, JSON.stringify(dev), function(err){
              if(err){
                reject(err);
              }
            });
            resolve(key);
          });
        });
      });
  };

  return {
    searchAndSaveDevs: saveDevelopers
  };

};


module.exports = exports = search();

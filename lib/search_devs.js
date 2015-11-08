var config = require('./config');
var repository = require('./repository')
var search = require('./search')

var search_devs = {}

search_devs.getNRepos = function (usermame) {
  var nRepos = config.search.no_of_repos

  search.repos(usermame)
  .then(repos) => {
     return repos.slice(1, nRepos)
   }
   .catch(function (errors) {
     console.log(errors);
   });
};

module.exports = search_devs

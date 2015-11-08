var config = require('./config');
var repository = require('./repository')

var search_devs = {}

search_devs.getNRepos = function (usermame, reponame) {
  var done = 0;
  var results = [];
  var nRepos = config.search.no_of_repos

//   // debugger
//   repository.getRepo(username, reponame)
//     .then(function (repo){
//       if(done === nRepos) done()
//       done++
//     })
//     .catch(function (errors) {
//       context.errors = errors
//       console.log(errors);
//     });
}

module.exports = search_devs

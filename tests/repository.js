var test = require('blue-tape');
var repository = require('../lib/repository');

var badRepo = require('./data/repository_notready');
var goodRepo = require('./data/repository');

test('Get package.json', function (t) {
  t.plan(2);

  repository.getPackageJson(badRepo).then(function(response) {
    t.equal(typeof response, 'object');
    t.equal(response.name, 'Gandalf');
  }, function(error) {
    t.end(error);
  });
});
//
// test('CONTRIBUTING.md does not exist', function (t) {
//   t.plan(1);
//
//   repository.checkContributingmd(badRepo).then(function(response) {
//   }, function(error) {
//     t.equal(error, 'not found');
//   });
// });

// test('CONTRIBUTING.md exists', function (t) {
//   t.plan(1);
//
//   repository.checkContributingmd(goodRepo).then(function(response) {
//     t.equal(response, 'ok');
//   }, function(error) {
//     t.end(error);
//   });
// });

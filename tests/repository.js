var test = require('tape');
var repository = require('../lib/repository');

var badRepo = require('./data/repository_notready');

test('Get package.json', function (t) {
  t.plan(2);

  repository.getPackageJson(badRepo).then(function(response) {
    t.equal(typeof response, 'object');
    t.equal(response.name, 'Gandalf');
  }, function(error) {
    t.end(error);
  });
});

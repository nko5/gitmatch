var test = require('tape');
var search = require('../lib/search');

test('Searching users on GitHub', function (t) {
  t.plan(2);
  search.users('javascript', 'Barcelona')
  .then((users) => {
    t.ok(users);
    t.assert(users.length > 0);
  })
  .catch((error) => {
    t.end(error);
  });
});

test.only('Searching repos on GitHub', function (t) {
  t.plan(2);
  search.repos('octocat')
  .then((repos) => {
    t.ok(repos);
    t.assert(repos.length > 0);
  })
  .catch((error) => {
    t.end(error);
  });
});

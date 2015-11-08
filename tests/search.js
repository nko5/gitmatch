var test = require('tape');
var search = require('../lib/search');

test('Searching users on GitHub', function (t) {
  t.plan(1);
  search.users('javascript', 'Spain')
  .then((users) => {
    t.equal(users.length, 30);
  })
  .catch((error) => {
    t.end(error);
  });
});

test('Searching repos on GitHub', function (t) {
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

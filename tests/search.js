var test = require('tape');
var search = require('../lib/search');

test.only('Searching users on GitHub', function (t) {
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

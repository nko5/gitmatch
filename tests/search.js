var test = require('tape');
var search = require('../lib/search');

test('Searching users on GitHub', function (t) {
  t.plan(2);
  search.users('javascript', 'Barcelona')
  .then((users) => {
    t.ok(users.items);
    t.notEqual(users.items.length, 0);
  })
  .catch((error) => {
    t.end(error);
  });
});

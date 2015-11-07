var test = require('tape');
var search = require('../lib/search');

test('Searching users on GitHub', function (t) {
  t.plan(3);
  search.users('javascript', 'Barcelona', function(err, users){
    t.equal(err,null);
    t.ok(users.items);
    t.notEqual(users.items.length, 0);
  });
});

var test = require('tape');
var search = require('../lib/search');

test('Searching users on GitHub', function (t) {
  t.plan(1);
  search.searchAndSaveDevs('tom', 'Barcelona')
    .then(() => {
      t.end();
    })
    .catch((error) => {
      t.end(error);
    });
});

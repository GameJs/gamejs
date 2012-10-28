var uri = require('gamejs/utils/uri');

qModule('gamejs/utils/uri');


var data = [
  ['http://gamejs.org/example', ['http://gamejs.org/', './example']],
  ['http://gamejs.org/example/', ['http://gamejs.org/example/', '../example/']],
  ['http://gamejs.org/example', ['http://gamejs.org/example/data/', '../../example']],
  ['http://gamejs.org/for/ever/', ['http://gamejs.org/', './for/ever/']],
  ['http://gamejs.org/for/ever/', ['http://gamejs.org/test/data', '../../for/ever/']],
  ['http://gamejs.org/example', ['http://gamejs.org/test/data', 'http://gamejs.org/example']]
];

test('resolve', function() {
  data.forEach(function(res) {
    strictEqual(uri.resolve.apply(this, res[1]), res[0]);
  });
});

// FIXME Document.fromURL() unit test

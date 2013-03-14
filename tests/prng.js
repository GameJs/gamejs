var prng = require('gamejs/utils/prng');

qModule('gamejs/utils/prng');

test('seedable', function() {
   var seeds = ['gamejs', '12345', new Date()];
   seeds.forEach(function(s) {
      var aleaOne = new prng.Alea(s);
      var aleaTwo = new prng.Alea(s);
      // try a few
      for (var i = 0; i<10; i++) {
         equal(aleaOne.random(), aleaTwo.random());
      }
   });
});

test('instance', function() {
   prng.init('unit testing');
   equal(prng.integer(2, 10), 4);
   equal(prng.choose([1,2,3,4,5]), 3);
   deepEqual(prng.vector([1,2], [10,10]), [3, 4]);
   prng.init('re-init testing');
   equal(prng.random(), 0.7048633336089551);
});


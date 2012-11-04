var prng = require('gamejs/utils/prng');

qModule('gamejs/utils/prng');

test('seedable', function() {
   var seeds = ['gamejs', '12345', new Date()];
   seeds.forEach(function(s) {
      var aleaOne = new prng.Alea(s)
      var aleaTwo = new prng.Alea(s);
      // try a few
      for (var i = 0; i<10; i++) {
         equal(aleaOne.random(), aleaTwo.random());
      }
   });
});


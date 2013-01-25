var gamejs = require('gamejs');

gamejs.ready(function() {
   /// set to no-smoothing to be reproducable across browsers
   gamejs.display.setMode([0, 0], gamejs.display.NO_SMOOTHING);

   // NOTE can't name it `gamejs` because that would conflict with above
   // maybe yabble bug
   require('./base64');
   require('./binaryheap');
   require('./draw');
   require('./mask');
   require('./math');
   require('./pathfinding');
   require('./prng');
   require('./rectsurface');
   require('./sprite');
   require('./transform');
   require('./uri');
   require('./vectors');
   require('./xml');

});
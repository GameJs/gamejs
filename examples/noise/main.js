var gamejs = require('gamejs');
var SurfaceArray = require('gamejs/graphics').SurfaceArray;
var blitArray = require('gamejs/graphics').blitArray;

gamejs.ready(function() {
   // we will modify individual pixels directly, that's
   // easiest with a SurfaceArray
   var display = gamejs.display.getSurface();
   var dims = display.getSize();
   var displayArray = new SurfaceArray(display);


   // the same seed will reproduce the same pattern;
   // you can not use alea and pass nothing to Simplex and
   // it will use `Math.random()` instead.
   var seed = new Date();
   var alea = new gamejs.math.random.Alea(seed);

   // asign pixel colors according to the noise
   var simplex = new gamejs.math.noise.Simplex(alea);
   for (var i=0;i<dims[0];i++) {
      for (var j=0;j<dims[1];j++) {
         var val = simplex.get(i/50, j/50) * 255;
         var r = val > 0 ? val : 0;
         var b = val < 0 ? -val : 0;
         displayArray.set(i, j, [r, 0, b]);
      }
   }
   // and blit the modified array back to the display
   // with the extra fast gamejs.graphics.blitArray function
   blitArray(display, displayArray);
});

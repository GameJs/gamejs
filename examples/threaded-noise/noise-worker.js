var gamejs = require('gamejs');
var logger = require('gamejs/logging');

// create array with noise data to display
var createNoise = function(dimensions) {
   var simplex = new gamejs.math.noise.Simplex(Math);
   var surfaceData = [];
   for (var i=0;i<dimensions[0];i++) {
      surfaceData[i] = [];
      for (var j=0;j<dimensions[1];j++) {
         var val = simplex.get(i/50, j/50) * 255;
         surfaceData[i][j] = val;
      }
   }
   return surfaceData;
}

gamejs.ready(function() {

   gamejs.event.onEvent(function(event) {
      logger.log('Recieved request for noise data with dimensions', event.dimensions);
      //
      // create noise with right dimensions and send it back
      gamejs.thread.post({
         noiseData: createNoise(event.dimensions)
      });
   })

})
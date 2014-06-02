var gamejs = require("gamejs");
var SurfaceArray = require('gamejs/graphics').SurfaceArray;
var blitArray = require('gamejs/graphics').blitArray;
var logger = require('gamejs/logging');

gamejs.ready(function() {
   var display = gamejs.display.getSurface();
   var dims = display.getSize();
   var displayArray = new SurfaceArray(display);
   var infoFont = new gamejs.font.Font();


   var versionCounter = 0;
   var updateDisplay = function(noiseData) {
      // asign pixel colors according to the noise
      for (var i=0;i<dims[0];i++) {
         for (var j=0;j<dims[1];j++) {
            var val = noiseData[i][j];
            var r = val > 0 ? val : 0;
            var b = val < 0 ? -val : 0;
            displayArray.set(i, j, [r, 0, b]);
         }
      }
      // and blit the modified array back to the display
      // with the extra fast gamejs.graphics.blitArray function
      blitArray(display, displayArray);
      versionCounter++;
      display.blit(infoFont.render('Displaying noise version #' + versionCounter, '#ffffff'));
   };

   // spawn a thread with the main module "./noise-worker", which
   // will create the noise data
   var noiseWorker = new gamejs.thread.Worker('./noise-worker');
   // recieve noise data from worker
   noiseWorker.onEvent(function(event){
      logger.log('Recieved noise data from worker');
      updateDisplay(event.noiseData);
      // .. and request new noise data, after a short delay
      setTimeout(function() {
         noiseWorker.post({
            dimensions: display.getSize()
         })
      }, 1000)
   })


   // send dimensions to worker so he starts creating noise data
   noiseWorker.post({
      dimensions: display.getSize()
   });

});

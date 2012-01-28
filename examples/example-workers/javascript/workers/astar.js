var gamejs = require('gamejs');
gamejs.time.init();

var initialized = false;

var handleEvent = function(event) {
   if (event.data.question === 'the meaning of life') {
      // start massive calculation
      var j =0;
      for (var i = 0; i < 1000000;i++) {
         j+=i;
      }
      self.postMessage({
         type: gamejs.event.WORKER_RESULT,
         data: {answer: '42'}
      });
   }
}

self.onmessage = function(event) {
   if (!initialized) {
      //gamejs.time.fpsCallback(tick, self, 1);
      initialized  = true;
      self.postMessage({
         type: gamejs.event.WORKER_ALIVE
      });
      return;
   }
   handleEvent(event.data);
}

/*var tick = function(msDuration) {
   self.postMessage({type: gamejs.event.WORKER_RESULT, data: {answer: 'running '}});
}
*/



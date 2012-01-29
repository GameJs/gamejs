/**
 * A bare bones Sprite and sprite Group example.
 *
 * We move a lot of Ship sprites across the screen with varying speed. The sprites
 * rotate themselves randomly. The sprites bounce back from the bottom of the
 * screen.
 */

var gamejs = require('gamejs');


function main() {
   // screen setup
   gamejs.display.setMode([800, 600]);
   gamejs.display.setCaption("Example Workers");
   
   var display = gamejs.display.getSurface();
   // create a background worker. you can only talk
   // to it through the event system.
   gamejs.worker.create(
      'astarOne',
      './workers/astar'
   );
   // the message will go to the workers event queue; we won't see it
   // again here
   var handleEvent = function(event) {
      if (event.type == gamejs.event.WORKER_RESULT) {
         gamejs.log('Answer from ' + event.workerId +' is: ' + (event.data && event.data.answer));
      } else if (event.type == gamejs.event.WORKER_ALIVE) {
         // send a question to the worker
         gamejs.event.post({
            type: gamejs.event.WORKER,
            workerId: 'astarOne',
            data: {question: 'the meaning of life'},
         });
         gamejs.log('Waiting for result...');
      }
   }

   var tick = function(msDuration) {
      gamejs.event.get().forEach(handleEvent);
   };
   gamejs.time.fpsCallback(tick, this, 1000);

}

/**
 * M A I N
 */
gamejs.ready(main);

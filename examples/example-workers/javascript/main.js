/**
 * Creates a Worker which - given a starting number - will produce
 * primes coming after that number.
 *
 * This examples shows how messages are being sent from and to a worker, and that
 * the number-crunching worker does not block the browser's UI (like a normal script
 * running this long would).
 */

var gamejs = require('gamejs');


function main() {
   // screen setup
   var display = gamejs.display.setMode([800, 600]);
   gamejs.display.setCaption("Example Workers");
   var font = new gamejs.font.Font();

   // create a background worker
   var primeWorker = new gamejs.worker.Worker('./primes');

   // send a question to the worker
   var startNumber = parseInt(1230023 + (Math.random() * 10000));
   display.blit(font.render('Asking worker for primes after ' + startNumber), [10,30]);
   primeWorker.post({
      todo: "nextprimes", start: startNumber
   });
   // instead of using `Worker.post()` like above, you could also
   // send the message via the normal gamejs.event queue:
   /*
   gamejs.event.post({
      worker: primeWorker,
      type: gamejs.event.WORKER,
      data: {todo: "nextprimes", start: startNumber}
   });
   */

   // wait for results...
   var yOffset = 50;
   var handleEvent = function(event) {
      if (event.type == gamejs.event.WORKER_RESULT) {
         display.blit(font.render('Worker answered: ' + event.data.prime), [10, yOffset])
         yOffset += 20;
      }
   }

   var tick = function(msDuration) {
      gamejs.event.get().forEach(handleEvent);
   };
   gamejs.time.fpsCallback(tick, this, 100);
}

gamejs.ready(main);

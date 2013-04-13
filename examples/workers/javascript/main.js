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
   primeWorker.post({
      todo: "nextprimes", start: startNumber
   });

   // wait for results...
   var primes = [];
   primeWorker.onEvent(function(event) {
      primes.push(event.prime);
   });

   primeWorker.onError(function(data) {
      gamejs.log('worker threw an exception', data);
   });

   // draw resutls
   gamejs.onTick(function(msDuration) {
      var yOffset = 56;
      display.clear();
      display.blit(font.render('Worker is producing primes bigger than ' + startNumber), [10,30]);
      primes.forEach(function(p, idx) {
         display.blit(font.render('#' + idx  + ': ' + p), [10, yOffset])
         yOffset += 20;
      });

   });
}

gamejs.ready(main);

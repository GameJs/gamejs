/**
 * This worker responds to a message `{todo: "nextprimes", start: 123}`
 *
 * and will return five primes after the `start` number. It will
 * skip 100.000 primes between each of those five.
 * (arbitrary algorithm, designed to be long running)
 */
var gamejs = require('gamejs');

var handleEvent = function(event) {
   if (event.type === gamejs.event.WORKER) {
      if (event.data.todo === 'nextprimes') {
         var foundPrime = false;
         var n = event.data.start;
         var primes = [];
         var x = 10000;
         search: while(primes.length < 5) {
            n += 1;
            for (var i = 2; i <= Math.sqrt(n); i += 1) {
               if (n % i == 0) {
                  continue search;
               }
            }
            if (x-- < 0) {
               primes.push(n);
               // found the next prime
               gamejs.event.post({
                  type: gamejs.event.WORKER_RESULT,
                  data: {prime: n}
               })
               x = 10000;
            }
         };
      } else {
         gamejs.event.post('unknown todo')
      }
   }
}
gamejs.ready(function() {
   var tick = function(msDuration) {
      gamejs.event.get().forEach(handleEvent);
   }

   gamejs.time.fpsCallback(tick, null, 1000)

})

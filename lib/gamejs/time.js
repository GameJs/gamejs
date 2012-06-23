/**
 * @fileoverview
 * Provides tools for game time managment.
 *
 * This is very different from how PyGame works. We can not
 * pause the execution of the script in Browser JavaScript, so what
 * we do you do is write a main function which contains the code
 * you would put into your main loop and pass that to `fpsCallback()`:
 *
 * @example
 *     function main() {
 *         // update models
 *         // draw to screen
 *      };
 *      gamejs.time.fpsCallback(main, this, 30);
 *      ;
 *      function aiUpdate() {
 *         // do stuff that needs low update rates
 *      }
 *      gamejs.time.fpsCallback(aiUpdate, this, 10);
 *
 *
 */


var TIMER_LASTCALL = null;
var CALLBACKS = {};
var CALLBACKS_LASTCALL = {};
var TIMER = null;
var STARTTIME = null;

/**
 * @ignore
 */
exports.init = function() {
   STARTTIME = Date.now();
   TIMER = setInterval(perInterval, 10);
   return;
};

/**
 * @param {Function} fn the function to call back
 * @param {Object} thisObj `this` will be set to that object when executing the function
 * @param {Number} fps specify the framerate by which you want the callback to be called. (e.g. 30 = 30 times per seconds). default: 30
 */
exports.fpsCallback = function(fn, thisObj, fps) {
   if ( fps === undefined ) {
     fps = 30;
   }

   fps = parseInt(1000/fps, 10);
   CALLBACKS[fps] = CALLBACKS[fps] || [];
   CALLBACKS_LASTCALL[fps] = CALLBACKS_LASTCALL[fps] || 0;

   CALLBACKS[fps].push({
      'rawFn': fn,
      'callback': function(msWaited) {
         fn.apply(thisObj, [msWaited]);
      }
   });
   return;
};

/**
 * @param {Function} callback the function delete
 * @param {Number} fps
 */
exports.deleteCallback = function(callback, fps) {
   fps = parseInt(1000/fps, 10);
   var callbacks = CALLBACKS[fps];
   if (!callbacks) {
      return;
   }

   CALLBACKS[fps] = callbacks.filter(function(fnInfo, idx) {
      if (fnInfo.rawFn !== callback) {
         return true;
      }
      return false;
   });
   return;
};

var perInterval = function() {
   var msNow = Date.now();
   var lastCalls = CALLBACKS_LASTCALL;
   function callbackWrapper(fnInfo) {
      fnInfo.callback(msWaited);
   }
   for (var fpsKey in lastCalls) {
      if (!lastCalls[fpsKey]) {
         CALLBACKS_LASTCALL[fpsKey] = msNow;
      }
      var msWaited = msNow - lastCalls[fpsKey];
      if (fpsKey <= msWaited) {
         CALLBACKS_LASTCALL[fpsKey] = msNow;
         CALLBACKS[fpsKey].forEach(callbackWrapper, this);
      }
   }
   return;
};

/**
 * @fileoverview
 * Provides tools for game time managment.
 *
 * This is very different from how PyGame works. We can not
 * pause the execution of the script in Browser JavaScript, so what
 * we do you do is write a main function which contains the code
 * you would put into your main loop and pass that to `gamejs.time.interval()`:
 *
 * @example
 *  // call function `tick` as fast as the browser thinks is appropriate
 *  gamejs.time.interval(tick);
 *  // call the function `tick` maximally 20 times per second
 *  gamejs.time.interval(tick, 20);
 *
 *
 */


var TIMER_LASTCALL = null;
var CALLBACKS = {};
var CALLBACKS_LASTCALL = {};
var STARTTIME = null;

// `window` is not accessible in webworker (would lead to TypeError)
// @@ this cross-browser fuckery has to go away ASAP.
var reqAnimationFrame = typeof(window) != 'undefined' ?
                        window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        null : null;

var reqAniFrameRecursive = function() {
   perInterval();
   reqAnimationFrame(reqAniFrameRecursive)
}

/**
 * @ignore
 */
exports.init = function() {
   STARTTIME = Date.now();

   if (reqAnimationFrame) {
      reqAnimationFrame(reqAniFrameRecursive);
   } else {
      setInterval(perInterval, 10);
   }
   return;
};

/**
 * Call a function as fast as the browser thinks is good for an animation.
 *
 * Alternatively, the desired "frames per second" (fps) can be passed as
 * the second argument. This will limit the calls to the function to happen
 * at most this often per second. "fps" is thus a colloquial term for
 * "callback frequency per second".
 *
 * If you do not specify a required callback frequency but let the browser
 * decided how often the function should get called, then beware that the browser
 * can schedule your function to only be called as rarely as once per second
 * (for example, if the browser window is not visible).

 * @param {Function} fn the function to be called
 * @param {Number} fps optional callback frequency per second
 * @param {Object} thisObj optional context for callback function
 */
exports.interval = function(fn, fps, thisObj) {
   // both args are optional
   if (thisObj === undefined && isNaN(fps)) {
      thisObj = fps;
      fps = undefined;
   }
   fpsCallback(fn, thisObj, fps);
   return;
}

/**
 * This function is deprecated in favor of `gamejs.time.interval`
 * @see #interval
 *
 * @param {Function} fn the function to call back
 * @param {Object} thisObj `this` will be set to that object when executing the callback function
 * @param {Number} fps specify the framerate by which you want the callback to be called. (e.g. 30 = 30 times per seconds). default: 60
 * @deprecated
 * @ignore
 */
var fpsCallback = exports.fpsCallback = function(fn, thisObj, fps) {
   if (fps === undefined) {
     fps = 60;
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
 * @deprecated
 * @ignore
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

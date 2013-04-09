/**
 * @fileoverview
 * Only used by GameJs internally to provide a game loop.
 * @ignore
 */

var Callback = require('./callback').Callback;

var TIMER_LASTCALL = null;
var STARTTIME = null;

/** @ignore **/
var _CALLBACK = exports._CALLBACK = new Callback(function(){}, {});
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

var perInterval = function() {
   var msNow = Date.now();
   exports._CALLBACK.trigger(msNow - (TIMER_LASTCALL || msNow));
   TIMER_LASTCALL = msNow;
   return;
};

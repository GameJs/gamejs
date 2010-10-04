var display = require('gamejs/display');

/**
 * @fileoverview Methods for polling mouse & keyboard.
 *
 * Call get() in your main loop to get a list of events that happend since you last called.
 *
 *
 * A pattern for using this might look like so: your main game function (tick in this example) 
 * is being called by [gamejs.time.fpsCallback()](../time/#fpsCallback) 25 times per second.
 * Inside tick we call [gamejs.event.get()](#get) for a list of events that happened since the last
 * tick and we loop over each event and act on what the event properties.
 * 
 *     function tick() {
 *        gamejs.event.get().forEach(function(event) {
 *           if (event.type === gamejs.event.MOUSEUP) {
 *              gamejs.log(event.pos);
 *           }
 *        });
 *     };
 *     gamejs.time.fpsCallback(tick, this, 25);
 *
 * The main types of events handled are currently:
 *
 *  * KEYDOWN
 *  * KEYUP
 *  * MOUSEUP
 *  * MOUSEDOWN
 *  * QUIT
 *
 */
// key constants
exports.K_UP = 38;
exports.K_DOWN = 40;
exports.K_RIGHT = 39;
exports.K_LEFT = 37;
exports.K_SPACE = 32;
exports.K_ENTER = 13;
exports.K_m = 77;
exports.K_CTRL = 17;
exports.K_ALT = 18;

exports.K_KP1 = 97;
exports.K_KP2 = 98;
exports.K_KP3 = 99;
exports.K_KP4 = 100;
exports.K_KP5 = 101;
exports.K_KP6 = 102;
exports.K_KP7 = 103;
exports.K_KP8 = 104;
exports.K_KP9 = 105;

// event type constants
var QUIT = exports.QUIT = 0;
var KEYDOWN = exports.KEYDOWN = 1;
var KEYUP = exports.KEYUP = 2;
var MOUSEMOTION = exports.MOUSEMOTION = 3;
var MOUSEUP = exports.MOUSEUP = 4
var MOUSEDOWN = exports.MOUSEDOWN = 5;
var USEREVENT = exports.USEREVENT = 99;

var QUEUE = [];

/**
 * Get the oldest event from the event queue
 * @returns {gamejs.event.Event}
 */
exports.get = function() {
   return QUEUE.splice(0);
};

/**
 * Get the newest event of the event queue
 * @returns {gamejs.event.Event}
 */
exports.poll = function() {
   return QUEUE.pop();
};

/**
 * Post an event to the event queue.
 * @param {gamejs.event.Event} userEvent the event to post to the queue
 */
exports.post = function(userEvent) {
   QUEUE.push(userEvent);
   return;
};

/**
 * Holds all information about an event.
 * @class
 */

exports.Event = function() {
/**
 * 
 */
    /**
     * @property {Number} key the keyCode of the key
     * @property {Number[]} rel .
     * @property {Number} button 
     * @property {Number[]}  
     */
    /**
     * The type of the event. e.g., gamejs.event.QUIT, KEYDOWN, MOUSEUP.
     */
    this.type = null;
    /**
     * key the keyCode of the key
     */
    this.key = null;
    /**
     * relative movement for a mousemove event
     */
    this.rel = null;
    /**
     * the number of the mousebutton pressed
     */
    this.button = null;
    /**
     * pos the position of the event for mouse events
     */
    this.pos = null;
};

/**
 * @ignore
 */
exports.init = function() {
   // catching events: 
   // mousedown, mouseup,
   // keydown, keyup
   // mousemove
   // quit
   
   document.onmousedown = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      QUEUE.push({
         'type': MOUSEDOWN,
         'pos': [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]],
         'button': ev.button,
      });
   };

   document.onmouseup = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      QUEUE.push({
         'type':MOUSEUP,
         'pos': [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]],
         'button': ev.button,
      });
   };

   document.onkeydown = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      QUEUE.push({
         'type': KEYDOWN,
         'key': ev.keyCode,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey
      });
      return;
   };
   document.onkeyup = function(ev) {
      QUEUE.push({
         'type': KEYUP,
         'key': ev.keyCode,
         'shiftKey': ev.shiftKey,
         'ctrlKey': ev.ctrlKey,
         'metaKey': ev.metaKey            
      });
   };
   var lastPos = [];
   document.onmousemove = function(ev) {
      var canvasOffset = display._getCanvasOffset();
      var currentPos = [ev.clientX - canvasOffset[0], ev.clientY - canvasOffset[1]];
      var relativePos = [];
      if (lastPos.length) {
         relativePos = [
            lastPos[0] - currentPos[0],
            lastPos[1] - currentPos[1]
         ];
      }
      QUEUE.push({
         'type': MOUSEMOTION,
         'pos': currentPos,
         'rel': relativePos,
         'buttons': null, // FIXME, fixable?
         'timestamp': ev.timeStamp,
      });
      lastPos = currentPos;
      return;
   };
   document.onbeforeunload = function(ev) {
      QUEUE.push({
         'type': QUIT,
      });
      return;
   };
};

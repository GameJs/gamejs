var Surface = require('./graphics').Surface;

/**
 * @fileoverview Methods to create, access and manipulate the display Surface.
 *
 * You can just grab the canvas element whether it exists in the DOM or not (GameJs
 * will create it if necessary):
 *
 *     var display = gamejs.display.getSurface();
 *
 * If you need to resize the canvas - although it is recommended to style it with CSS - you can
 * call the `setMode()` function, which conviniently returns the new display surface:
 *
 *     newDisplay = gamejs.display.setMode([800, 600]);
 *
 * ### Browser window gets resized
 *
 * When the canvas size is configured with CSS, the display surface might change when
 * the browser window is resized. GameJs will internally deal with this and recreate
 * the the display surface with the new size.
 *
 * You will typically not have to worry about this but if you want to get informed
 * about a display resize, you can register a callback with `gamejs.event.onDisplayResize`.
 *
 *
 * ### Flags
 *
 * For advanced uses you can set a few modes which additionally change how the display
 * behaves with regards to pixel smoothing and whether you want a fullscreen canvas with
 * or withouth the mouse pointer locked inside the window (for endless mouse movement in
 * all directions).
 *
 *
 * `gamejs.display.setMode()` understands three flags:
 *
 *   * gamejs.display.FULLSCREEN
 *   * gamejs.display.DISABLE_SMOOTHING
 *   * gamejs.display.POINTERLOCK (implies FULLSCREEN)
 *
 * For example:
 *      // disable smoothing
 *      gamejs.display.setMode([800, 600], gamejs.display.DISABLE_SMOOTHING);
 *      // disable smoothing and fullscreen
 *      gamejs.display.setMode(
               [800, 600],
               gamejs.display.DISABLE_SMOOTHING | gamejs.display.FULLSCREEN
         );
 *
 * ### Fullscreen mode
 *
 * When `setMode()` is called with the fullscreen flag then the fullscreen mode can be enabled by the
 * player by clicking on the DOM element with id "gjs-fullscreen-toggle". Browser security requires
 * that a user enables fullscreen with a "gesture" (e.g., clicking a button) and we can not enable fullscreen
 * in code.
 *
 * Fullscreen mode can be exited by many keys, e.g., anything window manager related (ALT-TAB) or ESC. A lot
 * of keys will trigger a browser information popup explaining how fullscreen mode can be exited.
 *
 * The following keys are "whitelisted" in fullscreen mode and will not trigger such a browser popup:
 *
 *  * left arrow, right arrow, up arrow, down arrow
 *  * space
 *  * shift, control, alt
 *  * page up, page down
 *  * home, end, tab, meta
 *
 *
 * ### Relevant DOM node ids accessed by this module
 *
 * You can provide your own tags with those ids
 *
 *   * gjs-canvas - the display surface
 *   * gjs-loader - loading bar
 *   * gjs-fullscreen-toggle a clickable element to enable fullscreen
 *   * gjs-canvas-wrapper this wrapper is added when in fullscreen mode
 *
 */

var CANVAS_ID = "gjs-canvas";
var LOADER_ID = "gjs-loader";
var SURFACE = null;

/**
 * Pass this flag to `gamejs.display.setMode(resolution, flags)` to disable
 * pixel smoothing; this is, for example, useful for retro-style, low resolution graphics
 * where you don't want the browser to smooth them when scaling & drawing.
 */
var DISABLE_SMOOTHING = exports.DISABLE_SMOOTHING = 2;
var FULLSCREEN = exports.FULLSCREEN = 4;
var POINTERLOCK = exports.POINTERLOCK = 8;

var _flags = 0;

/**
 * @returns {document.Element} the canvas dom element
 * @ignore
 */
var getCanvas = exports._getCanvas = function() {
   var displayCanvas = document.getElementById(CANVAS_ID);
   if (!displayCanvas) {
      displayCanvas = document.createElement("canvas");
      displayCanvas.setAttribute("id", CANVAS_ID);
      document.body.appendChild(displayCanvas);
   }
   return displayCanvas;
};


var getFullScreenToggle = function() {
   var fullScreenButton = document.getElementById('gjs-fullscreen-toggle');
   if (!fullScreenButton) {
      // before canvas
      fullScreenButton = document.createElement('button');
      fullScreenButton.innerHTML = 'Fullscreen';
      fullScreenButton.id = 'gjs-fullscreen-toggle';
      var canvas = getCanvas();
      canvas.parentNode.insertBefore(fullScreenButton, canvas);
      canvas.parentNode.insertBefore(document.createElement('br'), canvas);

   }
   return fullScreenButton;
};

var fullScreenChange = function(event) {
   var gjsEvent ={
      type: isFullScreen() ? require('./event').DISPLAY_FULLSCREEN_ENABLED :
                        require('./event').DISPLAY_FULLSCREEN_DISABLED

   };
   if (isFullScreen()) {
      if (_flags & POINTERLOCK) {
         enablePointerLock();
      }
   }
   require('./event')._triggerCallbacks(gjsEvent);
};

exports.hasPointerLock = function() {
   return !!(document.pointerLockElement ||
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.mozFullScreenElement);
};

function onResize(event) {
   var canvas = getCanvas();
   SURFACE._canvas.width = canvas.clientWidth;
   SURFACE._canvas.height = canvas.clientHeight;
   require('./event')._triggerCallbacks({
      type: require('./event').DISPLAY_RESIZE
   });
}

/**
 * Create the master Canvas plane.
 * @ignore
 */
exports.init = function() {
   // create canvas element if not yet present
   var canvas = getCanvas();
   if (!canvas.getAttribute('tabindex')) {
      // to be focusable, tabindex must be set
      canvas.setAttribute("tabindex", 1);
      canvas.focus();
   }
   // remove loader if any;
   var $loader = document.getElementById(LOADER_ID);
   if ($loader) {
      $loader.style.display = "none";
   }
   var $displaySurface = document.getElementById(CANVAS_ID);
   if ($displaySurface) {
      $displaySurface.style.display = 'block';
   }
   // hook into resize
   window.addEventListener("resize", onResize, false);
   return;
};

var isFullScreen = exports.isFullscreen = function() {
   return (document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.webkitDisplayingFullscreen);
};

/**
 * Switches the display window normal browser mode and fullscreen.
 * @ignore
 * @returns {Boolean} true if operation was successfull, false otherwise
 */
var enableFullScreen = function(event) {
   var wrapper = getCanvas();
   wrapper.requestFullScreen = wrapper.requestFullScreen || wrapper.mozRequestFullScreen || wrapper.webkitRequestFullScreen;
   if (!wrapper.requestFullScreen) {
      return false;
   }
   // @xbrowser chrome allows keboard input onl if ask for it (why oh why?)
   if (Element.ALLOW_KEYBOARD_INPUT) {
      wrapper.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
   } else {
      wrapper.requestFullScreen();
   }
   return true;
};

var enablePointerLock = function() {
   var wrapper = getCanvas();
   wrapper.requestPointerLock = wrapper.requestPointerLock || wrapper.mozRequestPointerLock || wrapper.webkitRequestPointerLock;
   if (wrapper.requestPointerLock) {
      wrapper.requestPointerLock();
   }
};

/** @ignore **/
exports._hasFocus = function() {
   return document.activeElement == getCanvas();
};

/**
 * Set the width and height of the Display. Conviniently this will
 * return the actual display Surface - the same as calling [gamejs.display.getSurface()](#getSurface)
 * later on.
 * @param {Array} dimensions [width, height] of the display surface
 * @param {Number} flags gamejs.display.DISABLE_SMOOTHING | gamejs.display.FULLSCREEN | gamejs.display.POINTERLOCK
 */
exports.setMode = function(dimensions, flags) {
   SURFACE = null;
   var canvas = getCanvas();
   canvas.width = canvas.clientWidth = dimensions[0];
   canvas.height = canvas.clientHeight = dimensions[1];

   _flags = _flags || flags;
   // @ xbrowser firefox allows pointerlock only if fullscreen
   if (_flags & POINTERLOCK) {
      _flags = _flags | FULLSCREEN;
   }
   if (_flags & FULLSCREEN) {
      // attach fullscreen toggle checkbox
      var fullScreenToggle = getFullScreenToggle();
      fullScreenToggle.removeEventListener('click', enableFullScreen, false);
      fullScreenToggle.addEventListener('click', enableFullScreen, false);
      // @@ xbrowser
      document.removeEventListener('fullScreenchange',fullScreenChange, false);
      document.removeEventListener('webkitfullscreenchange',fullScreenChange, false);
      document.removeEventListener('mozfullscreenchange',fullScreenChange, false);
      document.addEventListener('fullscreenchange', fullScreenChange, false);
      document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
      document.addEventListener('mozfullscreenchange', fullScreenChange, false);
   }
   return getSurface(dimensions);
};

/**
 * Set the Caption of the Display (document.title)
 * @param {String} title the title of the app
 * @param {gamejs.Image} icon FIXME implement favicon support
 */
exports.setCaption = function(title, icon) {
   document.title = title;
};

/** @ignore **/
exports._isSmoothingEnabled = function() {
   return !(_flags & DISABLE_SMOOTHING);
};

/**
 * The Display (the canvas element) is most likely not in the top left corner
 * of the browser due to CSS styling. To calculate the mouseposition within the
 * canvas we need this offset.
 * @see gamejs/event
 * @ignore
 *
 * @returns {Array} [x, y] offset of the canvas
 */

exports._getCanvasOffset = function() {
   var boundRect = getCanvas().getBoundingClientRect();
   return [boundRect.left, boundRect.top];
};

/**
 * Drawing on the Surface returned by `getSurface()` will draw on the screen.
 * @returns {gamejs.Surface} the display Surface
 */
var getSurface = exports.getSurface = function(dimensions) {
   if (SURFACE === null) {
      var canvas = getCanvas();
      if (dimensions === undefined) {
         dimensions = [canvas.clientWidth, canvas.clientHeight];
      }
      SURFACE = new Surface(dimensions);
      SURFACE._canvas = canvas;
      SURFACE._canvas.width = dimensions[0];
      SURFACE._canvas.height = dimensions[1];
      SURFACE._context = canvas.getContext('2d');
      if (!(_flags & DISABLE_SMOOTHING)) {
         SURFACE._smooth();
      } else {
         SURFACE._noSmooth();
      }
   }
   return SURFACE;
};

var Surface = require('../gamejs').Surface;

/**
 * @fileoverview Methods to create, access and manipulate the display Surface.
 *
 * @example
 * var display = gamejs.display.setMode([800, 600]);
 * // blit sunflower picture in top left corner of display
 * var sunflower = gamejs.image.load("images/sunflower");
 * display.blit(sunflower);
 *
 */

var CANVAS_ID = "gjs-canvas";
var LOADER_ID = "gjs-loader";
var SURFACE = null;

/**
 * @returns {document.Element} the canvas dom element
 */
var getCanvas = function() {
   var jsGameCanvas = null;
   var canvasList = Array.prototype.slice.call(document.getElementsByTagName("canvas"));
   canvasList.every(function(canvas) {
      if (canvas.getAttribute("id") == CANVAS_ID) {
         jsGameCanvas = canvas;
         return false;
      }
      return true;
   });
   return jsGameCanvas;
};

/**
 * Create the master Canvas plane.
 * @ignore
 */
exports.init = function() {
   // create canvas element if not yet present
   var jsGameCanvas = null;
   if ((jsGameCanvas = getCanvas()) === null) {
      jsGameCanvas = document.createElement("canvas");
      jsGameCanvas.setAttribute("id", CANVAS_ID);
      document.body.appendChild(jsGameCanvas);
   }
   // remove loader if any;
   var $loader = document.getElementById('gjs-loader');
   if ($loader) {
      $loader.style.display = "none";
   }
   return;
};

/**
 * Set the width and height of the Display. Conviniently this will
 * return the actual display Surface - the same as calling [gamejs.display.getSurface()](#getSurface))
 * later on.
 * @param {Array} dimensions [width, height] of the display surface
 */
exports.setMode = function(dimensions) {
   var canvas = getCanvas();
   canvas.width = dimensions[0];
   canvas.height = dimensions[1];
   return getSurface();
};

/**
 * Set the Caption of the Display (document.title)
 * @param {String} title the title of the app
 * @param {gamejs.Image} icon FIXME implement favicon support
 */
exports.setCaption = function(title, icon) {
   document.title = title;
};


/**
 * The Display (the canvas element) is most likely not in the top left corner
 * of the browser due to CSS styling. To calculate the mouseposition within the
 * canvas we need this offset.
 * @see {gamejs.event}
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
var getSurface = exports.getSurface = function() {
   if (SURFACE === null) {
      var canvas = getCanvas();
      SURFACE = new Surface([canvas.clientWidth, canvas.clientHeight]);
      SURFACE._canvas = canvas;
      SURFACE._context = canvas.getContext('2d');
      SURFACE._smooth();
   }
   return SURFACE;
};

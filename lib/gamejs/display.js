var Surface = require('gamejs').Surface;


/**
 * @fileoverview Methods to create, access and manipulate the display Surface.
 * Drawing to the screen is as simple as this:
 *
 *      var gamejs = require('gamejs');
 *      gamejs.preload(["images/sunflower.png"),
 *      gamejs.ready(function() {
 *          gamejs.display.setMode([800, 600]);
 *          var displaySurface = gamejs.display.getSurface();

 *          // blit sunflower picture in top left corner of display
 *          var sunflower = gamejs.image.load("images/sunflower");
 *          displaySurface.blit(sunflower);
 
 *          // and a little bit below that rotated
 *          var rotatedSunflower = gamejs.transform.rotate(gamejs.sunflower, 45);
 *          displaySurface.blit(rotatedSunflower, [0, 100]);
 *      });
 *
 */

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
   };
   //jsGameCanvas.setAttribute("style", "width:95%;height:85%");
   return;
};

/**
 * Set the width and height of the Display. Conviniently this will
 * return the actual display Surface - the same as calling [gamejs.display.getSurface()](#getSurface))
 * later on.
 * @param {Number[]} width and height the surface should be
 */
exports.setMode = function(rect) {
   var canvas = getCanvas();
   canvas.width = rect[0];
   canvas.height = rect[1];
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

var CANVAS_ID = "jsgamecanvas";
var SURFACE = null;


/**
 * The Display (the canvas element) is most likely not in the top left corner
 * of the browser due to CSS styling. To calculate the mouseposition within the
 * canvas we need this offset.
 * @see {gamejs.event}
 * @ignore
 *
 * @returns {Number[]} x and y offset of the canvas
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
   if (SURFACE == null) {
      var canvas = getCanvas();
      var SURFACE = new Surface([canvas.clientWidth, canvas.clientHeight]);
      SURFACE._canvas = canvas;
      // NOTE this is a hack. setting _canvas directly for the special main display surface
   }
   return SURFACE;
};

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

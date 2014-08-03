/**
 * @fileoverview
 * This module holds the important `Surface` class which is the general container for image data.
 *
 *     var surface = new gamejs.graphics.Surface([width, height]);
 *
 * The functions
 * to draw geometric lines like circles, lines, rectangles, etc. are also all in this module:
 *
 *     gamejs.graphics.line(surface, '#ff0000', centerPoint, radius);
 *
 * Each Surface instance has methods to create *a new* rotated, flipped, scaled, etc. instance of itself:
 *
 *     // the original `surface` remains untouched by the
 *     // filp operation. A new Surface instance
 *     // is returned by `flip()`.
 *     var horizontalFlippedSurface = surface.flip(true);
 *
 * If you want to put images (png, jpg) on the screen, also see the `gamejs.image` module and `gamejs.preload()`.
 *
 * There are several ways to specify colors. Whenever the docs says "valid #RGB string"
 * you can pass in any of the following formats: `"#ff00ff"`, `"rgb(255, 0, 255)"` or `"rgba(255, 0, 255, 1)"`.
 *
 * @see gamejs/image
 */
var gamejs = require('../gamejs');
var Rect = gamejs.Rect;
var objects = require('./utils/objects');

/**
 * transform functions
 */
var matrix = require('./math/matrix');
var vectors = require('./math/vectors');

/**
 * A Surface represents a bitmap image with a fixed width and height. The
 * most important feature of a Surface is that they can be `blitted`
 * onto each other.
 *
 * @example
 * new gamejs.graphics.Surface([width, height]);
 * new gamejs.graphics.Surface(width, height);
 * new gamejs.graphics.Surface(rect);
 * @constructor
 *
 * @param {Array} dimensions Array holding width and height
 */
var Surface = exports.Surface = function() {
   var args = gamejs.normalizeRectArguments.apply(this, arguments);
   var width = args.left;
   var height = args.top;
   // unless argument is rect:
   if (arguments.length == 1 && arguments[0] instanceof Rect) {
      width = args.width;
      height = args.height;
   }
   // only for rotatation & scale
   /** @ignore */
   this._matrix = matrix.identity();
   /** @ignore */
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;
    /** @ignore */
    this._blitAlpha = 1.0;

   /** @ignore */
   this._context = this._canvas.getContext('2d');
   // using exports is weird but avoids circular require
   if (gamejs.display._isSmoothingEnabled()) {
      this._smooth();
   } else {
      this._noSmooth();
   }
   return this;
};

/** @ignore */
Surface.prototype._noSmooth = function() {
    // disable image scaling
    // see https://developer.mozilla.org/en/Canvas_tutorial/Using_images#Controlling_image_scaling_behavior
    // and https://github.com/jbuck/processing-js/commit/65de16a8340c694cee471a2db7634733370b941c
    this.context.mozImageSmoothingEnabled = false;
  this.context.webkitImageSmoothingEnabled = false;
   return;
};
/** @ignore */
Surface.prototype._smooth = function() {
  this.context.mozImageSmoothingEnabled = true;
  this.context.webkitImageSmoothingEnabled = true;

};

/**
 * Blits another Surface on this Surface. The destination where to blit to
 * can be given (or it defaults to the top left corner) as well as the
 * Area from the Surface which should be blitted (e.g., for cutting out parts of
 * a Surface).
 *
 * @example
 * // blit flower in top left corner of display
 * displaySurface.blit(flowerSurface);
 *
 * // position flower at 10/10 of display
 * displaySurface.blit(flowerSurface, [10, 10])
 *
 * // ... `dest` can also be a rect whose topleft position is taken:
 * displaySurface.blit(flowerSurface, new gamejs.Rect([10, 10]);
 *
 * // only blit half of the flower onto the display
 * var flowerRect = flowerSurface.rect;
 * flowerRect = new gamejs.Rect([0,0], [flowerRect.width/2, flowerRect.height/2])
 * displaySurface.blit(flowerSurface, [0,0], flowerRect);
 *
 * @param {gamejs.graphics.Surface} src The Surface which will be blitted onto this one
 * @param {gamejs.Rect|Array} dst the Destination x, y position in this Surface.
 *            If a Rect is given, it's top and left values are taken. If this argument
 *            is not supplied the blit happens at [0,0].
 * @param {gamesjs.Rect|Array} area the Area from the passed Surface which
 *            should be blitted onto this Surface.
 * @param {Number} compositionOperation how the source and target surfaces are composited together; one of: source-atop, source-in, source-out, source-over (default), destination-atop, destination-in, destination-out, destination-over, lighter, copy, xor; for an explanation of these values see: http://dev.w3.org/html5/2dcontext/#dom-context-2d-globalcompositeoperation
 * @returns {gamejs.Rect} Rect actually repainted FIXME actually return something?
 */
Surface.prototype.blit = function(src, dest, area, compositeOperation) {

   var rDest, rArea;

   if (dest instanceof Rect) {
      rDest = dest.clone();
      var srcSize = src.getSize();
      if (!rDest.width) {
         rDest.width = srcSize[0];
      }
      if (!rDest.height) {
         rDest.height = srcSize[1];
      }
    } else if (dest && dest instanceof Array && dest.length == 2) {
      rDest = new Rect(dest, src.getSize());
    } else {
      rDest = new Rect([0,0], src.getSize());
    }
   compositeOperation = compositeOperation || 'source-over';

   // area within src to be drawn
   if (area instanceof Rect) {
      rArea = area;
   } else if (area && area instanceof Array && area.length == 2) {
      var size = src.getSize();
      rArea = new Rect(area, [size[0] - area[0], size[1] - area[1]]);
   } else {
      rArea = new Rect([0,0], src.getSize());
   }

   if (isNaN(rDest.left) || isNaN(rDest.top) || isNaN(rDest.width) || isNaN(rDest.height)) {
      throw new Error('[blit] bad parameters, destination is ' + rDest);
   }

   this.context.save();
   this.context.globalCompositeOperation = compositeOperation;
   this.context.globalAlpha = src._blitAlpha;
   this.context.drawImage(src.canvas, rArea.left, rArea.top, rArea.width, rArea.height, rDest.left, rDest.top, rDest.width, rDest.height);
   this.context.restore();
   return;
};

/**
 * @returns {Number[]} the width and height of the Surface
 */
Surface.prototype.getSize = function() {
   return [this.canvas.width, this.canvas.height];
};

/**
 * Obsolte, only here for compatibility.
 * @deprecated
 * @ignore
 * @returns {gamejs.Rect} a Rect of the size of this Surface
 */
Surface.prototype.getRect = function() {
   return new Rect([0,0], this.getSize());
};

/**
 * Fills the whole Surface with a color. Usefull for erasing a Surface.
 * @param {String} CSS color string, e.g. '#0d120a' or '#0f0' or 'rgba(255, 0, 0, 0.5)'
 * @param {gamejs.Rect} a Rect of the area to fill (defauts to entire surface if not specified)
 */
Surface.prototype.fill = function(color, rect) {
   this.context.save();
   this.context.fillStyle = color || "#000000";
   if (rect === undefined) {
       rect = new Rect(0, 0, this.canvas.width, this.canvas.height);
    }

   this.context.fillRect(rect.left, rect.top, rect.width, rect.height);
   this.context.restore();
   return;
};

/**
 * Clear the surface.
 */
Surface.prototype.clear = function(rect) {
   var size = this.getSize();
   rect = rect || new Rect(0, 0, size[0], size[1]);
   this.context.clearRect(rect.left, rect.top, rect.width, rect.height);
   return;
};

objects.accessors(Surface.prototype, {
   /**
    * @type gamejs.Rect
    */
   'rect': {
      get: function() {
         return this.getRect();
      }
   },
   /**
    * @ignore
    */
   'context': {
      get: function() {
         return this._context;
      }
   },
   'canvas': {
      get: function() {
         return this._canvas;
      }
   }
});

/**
 * @returns {gamejs.graphics.Surface} a clone of this surface
 */
Surface.prototype.clone = function() {
  var newSurface = new Surface(this.getRect());
  newSurface.blit(this);
  return newSurface;
};

/**
 * @returns {Number} current alpha value
 */
Surface.prototype.getAlpha = function() {
   return (1 - this._blitAlpha);
};

/**
 * Set the alpha value for the whole Surface. When blitting the Surface on
 * a destination, the pixels will be drawn slightly transparent.
 * @param {Number} alpha value in range 0.0 - 1.0
 * @returns {Number} current alpha value
 */
Surface.prototype.setAlpha = function(alpha) {
   if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      return;
   }

   this._blitAlpha = (1 - alpha);
   return (1 - this._blitAlpha);
};

/**
 * The data must be represented in left-to-right order, row by row top to bottom,
 * starting with the top left, with each pixel's red, green, blue, and alpha components
 * being given in that order for each pixel.
 * @see http://dev.w3.org/html5/2dcontext/#canvaspixelarray
 * @returns {ImageData} an object holding the pixel image data {data, width, height}
 */
Surface.prototype.getImageData = function() {
   var size = this.getSize();
   return this.context.getImageData(0, 0, size[0], size[1]);
};



// FIXME all draw functions must return a minimal rect containing the drawn shape

/**
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color valid #RGB string, e.g., "#ff0000"
 * @param {Array} startPos [x, y] position of line start
 * @param {Array} endPos [x, y] position of line end
 * @param {Number} width of the line, defaults to 1
 */
exports.line = function(surface, color, startPos, endPos, width) {
   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = color;
   ctx.lineWidth = width || 1;
   ctx.moveTo(startPos[0], startPos[1]);
   ctx.lineTo(endPos[0], endPos[1]);
   ctx.stroke();
   ctx.restore();
   return;
};

/**
 * Draw connected lines. Use this instead of indiviudal line() calls for
 * better performance
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB string, "#ff0000"
 * @param {Boolean} closed if true the last and first point are connected
 * @param {Array} pointlist holding array [x,y] arrays of points
 * @param {Number} width width of the lines, defaults to 1
 */
exports.lines = function(surface, color, closed, pointlist, width) {
   closed = closed || false;
   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   ctx.lineWidth = width || 1;
   pointlist.forEach(function(point, idx) {
      if (idx === 0) {
         ctx.moveTo(point[0], point[1]);
      } else {
         ctx.lineTo(point[0], point[1]);
      }
   });
   if (closed) {
      ctx.lineTo(pointlist[0][0], pointlist[0][1]);
   }
   ctx.stroke();
   ctx.restore();
   return;
};

/**
 * Draw a circle on Surface
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {Array} pos [x, y] position of the circle center
 * @param {Number} radius of the circle
 * @param {Number} width width of the circle, if not given or 0 the circle is filled
 */
exports.circle = function(surface, color, pos, radius, width) {
   if (isNaN(radius)) {
      throw new Error('[circle] radius required argument');
   }
   if (!pos || !(pos instanceof Array)) {
      throw new Error('[circle] pos must be given & array' + pos);
   }

   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   ctx.lineWidth = width || 1;
   ctx.arc(pos[0], pos[1], radius, 0, 2*Math.PI, true);
   if (width === undefined || width === 0) {
      ctx.fill();
   } else {
      ctx.stroke();
   }
   ctx.restore();
   return;
};

/**
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {gamejs.Rect} rect the position and dimension attributes of this Rect will be used
 * @param {Number} width the width of line drawing the Rect, if 0 or not given the Rect is filled.
 */
exports.rect = function(surface, color, rect, width) {
   var ctx =surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   if (isNaN(width) || width === 0) {
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
   } else {
      ctx.lineWidth = width || 1;
      ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
   }
   ctx.restore();
};

/**
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {Array} pos [x, y] position of the circle center
 * @param {Number} startAngle, both angles in radians
 * @param {Number} stopAngle
 * @param {Number} radius
 * @param {Number} width the width of line, if 0 or not given the arc is filled.
 */
exports.arc= function(surface, color, pos, startAngle, stopAngle, radius, width) {
   var ctx = surface.context;
   ctx.save();
   ctx.beginPath();
   ctx.strokeStyle = ctx.fillStyle = color;
   ctx.arc(pos[0], pos[1],
            radius,
            startAngle, stopAngle,
            false
         );
   if (isNaN(width) || width === 0) {
      ctx.fill();
   } else {
      ctx.lineWidth = width || 1;
      ctx.stroke();
   }
   ctx.restore();
};

/**
 * Draw a polygon on the surface. The pointlist argument are the vertices
 * for the polygon.
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color a valid #RGB String, #ff00cc
 * @param {Array} pointlist array of vertices [x, y] of the polygon
 * @param {Number} width the width of line, if 0 or not given the polygon is filled.
 */
exports.polygon = function(surface, color, pointlist, width) {
   var ctx = surface.context;
   ctx.save();
   ctx.fillStyle = ctx.strokeStyle = color;
   ctx.beginPath();
   pointlist.forEach(function(point, idx) {
      if (idx === 0) {
         ctx.moveTo(point[0], point[1]);
      } else {
         ctx.lineTo(point[0], point[1]);
      }
   });
   ctx.closePath();
   if (isNaN(width) || width === 0) {
      ctx.fill();
   } else {
      ctx.lineWidth = width || 1;
      ctx.stroke();
   }
   ctx.restore();
};

/**
 * Draw a quadratic curve with one control point on the surface.
 * The control point position defines the shape of the quadratic curve.
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color valid #RGB string, e.g., "#ff0000"
 * @param {Array} startPos [x, y] the start position for the quadratic curve
 * @param {Array} endPos [x, y] the end position for the quadratic curve
 * @param {Array} controlPos [x, y] position of the control point
 * @param {Number} width of the quadratic curve, defaults to 1
 */
exports.quadraticCurve = function(surface, color, startPos, endPos, controlPos, width) {
   if (!startPos || !(startPos instanceof Array)) {
      throw new Error('[quadratic_curve] startPos must be defined!');
   }
   if (!endPos || !(endPos instanceof Array)) {
      throw new Error('[quadratic_curve] endPos must be defined!');
   }
   if (!controlPos || !(controlPos instanceof Array)) {
      throw new Error('[quadratic_curve] controlPos must be defined!');
   }

   var ctx = surface.context;
   ctx.save();
   ctx.fillStyle = ctx.strokeStyle = color;
   ctx.lineWidth = width || 1;

   ctx.beginPath();
   ctx.moveTo(startPos[0], startPos[1]);
   ctx.quadraticCurveTo(controlPos[0], controlPos[1], endPos[0], endPos[1]);
   ctx.stroke();

   ctx.restore();
};

/**
 * Draw a bezier curve with two control points on the surface.
 * The control point positions define the shape of the bezier curve.
 *
 * @param {gamejs.graphics.Surface} surface the Surface to draw on
 * @param {String} color valid #RGB string, e.g., "#ff0000"
 * @param {Array} startPos [x, y] the start position for the bezier curve
 * @param {Array} endPos [x, y] the end position for the bezier curve
 * @param {Array} ct1Pos [x, y] position of the first control point
 * @param {Array} ct2Pos [x, y] position of the second control point
 * @param {Number} width of the bezier curve, defaults to 1
 */
exports.bezierCurve = function(surface, color, startPos, endPos, ct1Pos, ct2Pos, width) {
   if (!startPos || !(startPos instanceof Array)) {
      throw new Error('[bezier_curve] startPos must be defined!');
   }
   if (!endPos || !(endPos instanceof Array)) {
      throw new Error('[bezier_curve] endPos must be defined!');
   }
   if (!ct1Pos || !(ct1Pos instanceof Array)) {
      throw new Error('[bezier_curve] ct1Pos must be defined!');
   }
   if (!ct2Pos || !(ct2Pos instanceof Array)) {
      throw new Error('[bezier_curve] ct2Pos must be defined!');
   }
   var ctx = surface.context;
   ctx.save();
   ctx.fillStyle = ctx.strokeStyle = color;
   ctx.lineWidth = width || 1;

   ctx.beginPath();
   ctx.moveTo(startPos[0], startPos[1]);
   ctx.bezierCurveTo(ct1Pos[0], ct1Pos[1], ct2Pos[0], ct2Pos[1], endPos[0], endPos[1]);
   ctx.stroke();

   ctx.restore();
};

/**
 * Returns a new surface which holds this surface rotate by angle degrees.
 * Unless rotating by 90 degree increments, the image will be padded larger to hold the new size.
 * @param {angel} angle Clockwise angle by which to rotate
 * @returns {Surface} new, rotated surface
 */
Surface.prototype.rotate = function (angle) {
   var origSize = this.getSize();
   var radians = (angle * Math.PI / 180);
   var newSize = origSize;
   // find new bounding box
   if (angle % 360 !== 0) {
      var rect = this.getRect();
      var points = [
         [-rect.width/2, rect.height/2],
         [rect.width/2, rect.height/2],
         [-rect.width/2, -rect.height/2],
         [rect.width/2, -rect.height/2]
      ];
      var rotPoints = points.map(function(p) {
         return vectors.rotate(p, radians);
      });
      var xs = rotPoints.map(function(p) { return p[0]; });
      var ys = rotPoints.map(function(p) { return p[1]; });
      var left = Math.min.apply(Math, xs);
      var right = Math.max.apply(Math, xs);
      var bottom = Math.min.apply(Math, ys);
      var top = Math.max.apply(Math, ys);
      newSize = [right-left, top-bottom];
   }
   var newSurface = new Surface(newSize);
   var m = matrix.translate(this._matrix, origSize[0]/2, origSize[1]/2);
   m = matrix.rotate(m, radians);
   m = matrix.translate(m, -origSize[0]/2, -origSize[1]/2);
   var offset = [(newSize[0] - origSize[0]) / 2, (newSize[1] - origSize[1]) / 2];
   newSurface.context.save();
   newSurface.context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
   newSurface.blit(this, offset);
   newSurface.context.restore();
   return newSurface;
};

/**
 * Returns a new surface holding the scaled surface.
 * @param {Array} dimensions new [width, height] of surface after scaling
 * @returns {Surface} new, scaled surface
 */
Surface.prototype.scale = function(dims) {
   var width = dims[0];
   var height = dims[1];
   if (width <= 0 || height <= 0) {
      throw new Error('[gamejs.transform.scale] Invalid arguments for height and width', [width, height]);
   }
   var oldDims = this.getSize();
   var ws = width / oldDims[0];
   var hs = height / oldDims[1];
   var newSurface = new Surface([width, height]);
   var originalMatrix = this._matrix.slice(0);
   var m = matrix.scale(matrix.identity(), [ws, hs]);
   newSurface.context.save();
   newSurface.context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
   newSurface.blit(this);
   newSurface.context.restore();
   return newSurface;
};

/**
 * Flip a Surface either vertically, horizontally or both. This returns
 * a new Surface (i.e: nondestructive).
 * @param {Boolean} flipHorizontal
 * @param {Boolean} flipVertical
 * @returns {Surface} new, flipped surface
 */
Surface.prototype.flip = function(flipHorizontal, flipVertical) {
   var dims = this.getSize();
   var newSurface = new Surface(dims);
   var scaleX = 1;
   var scaleY = 1;
   var xPos = 0;
   var yPos = 0;
   if (flipHorizontal === true) {
      scaleX = -1;
      xPos = -dims[0];
   }
   if (flipVertical === true) {
      scaleY = -1;
      yPos = -dims[1];
   }
   newSurface.context.save();
   newSurface.context.scale(scaleX, scaleY);
   newSurface.context.drawImage(this.canvas, xPos, yPos);
   newSurface.context.restore();
   return newSurface;
};


/**
 * Directly copy values from an array into a Surface.
 *
 * This is faster than blitting the `surface` property on a SurfaceArray
 *
 * The array must be the same dimensions as the Surface and will completely
 * replace all pixel values.
 * @param {gamejs.graphics.Surface} surface
 * @param {gamejs.graphics.Surfacearray.SurfaceArray} surfaceArray
 */
exports.blitArray = function(surface, surfaceArray) {
   surface.context.putImageData(surfaceArray.imageData, 0, 0);
   return;
};

/**
 * Fast pixel access. The SurfaceArray can be constructed with a surface whose values
 * are then used to initialize the pixel array.
 *
 * The surface passed as argument is not modified by the SurfaceArray.
 *
 * If an array is used to construct SurfaceArray, the array must describe
 * the dimensions of the SurfaceArray [width, height].
 *
 * @example
 *
 *   // create array from display surface
 *   var srfArray = new SurfaceArray(display);
 *   // direct pixel access
 *   srfArray.set(50, 100, [255, 0, 0, 100]);
 *   console.log(srfArray.get(30, 50));
 *   // blit modified array back to display surface
 *   blitArray(display, srfArray);
 *
 * @param {gamejs.graphics.Surface|Array} surfaceOrDimensions
 * @see http://dev.w3.org/html5/2dcontext/#pixel-manipulation
 */
var SurfaceArray = exports.SurfaceArray = function(surfaceOrDimensions) {
   var size = null;
   var data = null;
   var imageData = null;

   /**
    * Set rgba value at position x, y.
    *
    * For performance reasons this function has only one signature
    * being Number, Number, Array[4].
    *
    * @param {Number} x x position of pixel
    * @param {Number} y y position of pixel
    * @param {Array} rgba [red, green, blue, alpha] values [255, 255, 255, 255] (alpha, the last argument defaults to 255)
    * @throws Error if x, y out of range
    */
   this.set = function(x, y, rgba) {
      var offset = (x * 4) + (y * size[0] * 4);
      /** faster without
      if (offset + 3 >= data.length || x < 0 || y < 0) {
         throw new Error('x, y out of range', x, y);
      }
      **/
      data[offset] = rgba[0];
      data[offset+1] = rgba[1];
      data[offset+2] = rgba[2];
      data[offset+3] = rgba[3] === undefined ? 255 : rgba[3];
      return;
   };

   /**
    * Get rgba value at position xy,
    * @param {Number} x
    * @param {Number} y
    * @returns {Array} [red, green, blue, alpha]
    */
   this.get = function(x, y) {
      var offset = (x * 4) + (y * size[0] * 4);
      return [
         data[offset],
         data[offset+1],
         data[offset+2],
         data[offset+3]
      ];
   };

   /**
    * a new gamejs.graphics.Surface on every access, representing
    * the current state of the SurfaceArray.
    * @type {gamejs.graphics.Surface}
    */
   // for jsdoc only
   this.surface = null;

   objects.accessors(this, {
      surface: {
         get: function() {
            var s = new gamejs.graphics.Surface(size);
            s.context.putImageData(imageData, 0, 0);
            return s;
         }
      },
      imageData: {
         get: function() {
            return imageData;
         }
      }
   });

   this.getSize = function() {
      return size;
   };

   /**
    * constructor
    */
   if (surfaceOrDimensions instanceof Array) {
      size = surfaceOrDimensions;
      imageData = gamejs.display.getSurface().context.createImageData(size[0], size[1]);
      data = imageData.data;
   } else {
      size = surfaceOrDimensions.getSize();
      imageData = surfaceOrDimensions.getImageData(0, 0, size[0], size[1]);
      data = imageData.data;
   }
   return this;
};

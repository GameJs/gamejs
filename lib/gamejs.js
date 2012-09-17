var matrix = require('./gamejs/utils/matrix');
var objects = require('./gamejs/utils/objects');

/**
 * @fileoverview This module holds the essential `Rect` and `Surface` classes as
 * well as static methods for preloading assets. `gamejs.ready()` is maybe
 * the most important as it kickstarts your app.
 *
 */

var DEBUG_LEVELS = ['info', 'warn', 'error', 'fatal'];
var debugLevel = 2;

/**
 * set logLevel as string or number
 *   * 0 = info
 *   * 1 = warn
 *   * 2 = error
 *   * 3 = fatal
 *
 * @example
 * gamejs.setLogLevel(0); // debug
 * gamejs.setLogLevel('error'); // equal to setLogLevel(2)
 */
exports.setLogLevel = function(logLevel) {
   if (typeof logLevel === 'string' && DEBUG_LEVELS.indexOf(logLevel)) {
      debugLevel = DEBUG_LEVELS.indexOf(logLevel);
   } else if (typeof logLevel === 'number') {
      debugLevel = logLevel;
   } else {
      throw new Error('invalid logLevel ', logLevel, ' Must be one of: ', DEBUG_LEVELS);
   }
   return debugLevel;
};
/**
 * Log a msg to the console if console is enable
 * @param {String} msg the msg to log
 */
var log = exports.log = function() {

   if (gamejs.worker.inWorker === true) {
      gamejs.worker._logMessage(arguments);
      return;
   }

   // IEFIX can't call apply on console
   var args = Array.prototype.slice.apply(arguments, [0]);
   args.unshift(Date.now());
   if (window.console !== undefined && console.log.apply) {
      console.log.apply(console, args);
   }
};
exports.info = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('info')) {
      log.apply(this, arguments);
   }
};
exports.warn = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('warn')) {
      log.apply(this, arguments);
   }
};
exports.error = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('error')) {
      log.apply(this, arguments);
   }
};
exports.fatal = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('fatal')) {
      log.apply(this, arguments);
   }
};

/**
 * Normalize various ways to specify a Rect into {left, top, width, height} form.
 *
 */
function normalizeRectArguments() {
   var left = 0;
   var top = 0;
   var width = 0;
   var height = 0;

   if (arguments.length === 2) {
      if (arguments[0] instanceof Array && arguments[1] instanceof Array) {
         left = arguments[0][0];
         top = arguments[0][1];
         width = arguments[1][0];
         height = arguments[1][1];
      } else {
         left = arguments[0];
         top = arguments[1];
      }
   } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      left = arguments[0][0];
      top = arguments[0][1];
      width = arguments[0][2];
      height = arguments[0][3];
   } else if (arguments.length === 1 && arguments[0] instanceof Rect) {
      left = arguments[0].left;
      top = arguments[0].top;
      width = arguments[0].width;
      height = arguments[0].height;
   } else if (arguments.length === 4) {
      left = arguments[0];
      top = arguments[1];
      width = arguments[2];
      height = arguments[3];
   } else {
      throw new Error('not a valid rectangle specification');
   }
   return {left: left || 0, top: top || 0, width: width || 0, height: height || 0};
}

/**
 * Creates a Rect. Rects are used to hold rectangular areas. There are a couple
 * of convinient ways to create Rects with different arguments and defaults.
 *
 * Any function that requires a `gamejs.Rect` argument also accepts any of the
 * constructor value combinations `Rect` accepts.
 *
 * Rects are used a lot. They are good for collision detection, specifying
 * an area on the screen (for blitting) or just to hold an objects position.
 *
 * The Rect object has several virtual attributes which can be used to move and align the Rect:
 *
 *   top, left, bottom, right
 *   topleft, bottomleft, topright, bottomright
 *   center
 *   width, height
 *   w,h
 *
 * All of these attributes can be assigned to.
 * Assigning to width or height changes the dimensions of the rectangle; all other
 * assignments move the rectangle without resizing it. Notice that some attributes
 * are Numbers and others are pairs of Numbers.
 *
 * @example
 * new Rect([left, top]) // width & height default to 0
 * new Rect(left, top) // width & height default to 0
 * new Rect(left, top, width, height)
 * new Rect([left, top], [width, height])
 * new Rect(oldRect) // clone of oldRect is created
 *
 * @property {Number} right
 * @property {Number} bottom
 * @property {Number} center
 *
 * @param {Array|gamejs.Rect} position Array holding left and top coordinates
 * @param {Array} dimensions Array holding width and height
 */
var Rect = exports.Rect = function() {

   var args = normalizeRectArguments.apply(this, arguments);

   /**
    * Left, X coordinate
    * @type Number
    */
   this.left = args.left;

   /**
    * Top, Y coordinate
    * @type Number
    */
   this.top = args.top;

   /**
    * Width of rectangle
    * @type Number
    */
   this.width = args.width;

   /**
    * Height of rectangle
    * @type Number
    */
   this.height = args.height;

   return this;
};

objects.accessors(Rect.prototype, {
   /**
    * Bottom, Y coordinate
    * @name Rect.prototype.bottom
    * @type Number
    */
   'bottom': {
      get: function() {
         return this.top + this.height;
      },
      set: function(newValue) {
         this.top = newValue - this.height;
         return;
      }
   },
   /**
    * Right, X coordinate
    * @name Rect.prototype.right
    * @type Number
    */
   'right': {
      get: function() {
         return this.left + this.width;
      },
      set: function(newValue) {
         this.left = newValue - this.width;
      }
   },
   /**
    * Center Position. You can assign a rectangle form.
    * @name Rect.prototype.center
    * @type Array
    */
   'center': {
      get: function() {
         return [this.left + (this.width / 2) | 0,
                 this.top + (this.height / 2) | 0
                ];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.left = args.left - (this.width / 2) | 0;
         this.top = args.top - (this.height / 2) | 0;
         return;
      }
   },
   /**
    * Top-left Position. You can assign a rectangle form.
    * @name Rect.prototype.topleft
    * @type Array
    */
   'topleft': {
      get: function() {
         return [this.left, this.top];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.left = args.left;
         this.top = args.top;
         return;
      }
   },
   /**
    * Bottom-left Position. You can assign a rectangle form.
    * @name Rect.prototype.bottomleft
    * @type Array
    */
   'bottomleft': {
      get: function() {
         return [this.left, this.bottom];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.left = args.left;
         this.bottom = args.bottom;
         return;
      }
   },
   /**
    * Top-right Position. You can assign a rectangle form.
    * @name Rect.prototype.topright
    * @type Array
    */
   'topright': {
      get: function() {
         return [this.right, this.top];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.right = args.right;
         this.top = args.top;
         return;
      }
   },
   /**
    * Bottom-right Position. You can assign a rectangle form.
    * @name Rect.prototype.bottomright
    * @type Array
    */
   'bottomright': {
      get: function() {
         return [this.right, this.bottom];
      },
      set: function() {
         var args = normalizeRectArguments.apply(this, arguments);
         this.right = args.right;
         this.bottom = args.bottom;
         return;
      }
   },
   /**
    * Position x value, alias for `left`.
    * @name Rect.prototype.y
    * @type Array
    */
   'x': {
      get: function() {
         return this.left;
      },
      set: function(newValue) {
         this.left = newValue;
         return;
      }
   },
   /**
    * Position y value, alias for `top`.
    * @name Rect.prototype.y
    * @type Array
    */
   'y': {
      get: function() {
         return this.top;
      },
      set: function(newValue) {
         this.top = newValue;
         return;
      }
   }
});

/**
 * Move returns a new Rect, which is a version of this Rect
 * moved by the given amounts. Accepts any rectangle form.
 * as argument.
 *
 * @param {Number|gamejs.Rect} x amount to move on x axis
 * @param {Number} y amount to move on y axis
 */
Rect.prototype.move = function() {
   var args = normalizeRectArguments.apply(this, arguments);
   return new Rect(this.left + args.left, this.top + args.top, this.width, this.height);
};

/**
 * Move this Rect in place - not returning a new Rect like `move(x, y)` would.
 *
 * `moveIp(x,y)` or `moveIp([x,y])`
 *
 * @param {Number|gamejs.Rect} x amount to move on x axis
 * @param {Number} y amount to move on y axis
 */
Rect.prototype.moveIp = function() {
   var args = normalizeRectArguments.apply(this, arguments);
   this.left += args.left;
   this.top += args.top;
   return;
};

/**
 * Return the area in which this Rect and argument Rect overlap.
 *
 * @param {gamejs.Rect} Rect to clip this one into
 * @returns {gamejs.Rect} new Rect which is completely inside the argument Rect,
 * zero sized Rect if the two rectangles do not overlap
 */
Rect.prototype.clip = function(rect) {
   if(!this.collideRect(rect)) {
      return new Rect(0,0,0,0);
   }

   var x, y, width, height;

   // Left
   if ((this.left >= rect.left) && (this.left < rect.right)) {
      x = this.left;
   } else if ((rect.left >= this.left) && (rect.left < this.right)) {
      x = rect.left;
   }

   // Right
   if ((this.right > rect.left) && (this.right <= rect.right)) {
      width = this.right - x;
   } else if ((rect.right > this.left) && (rect.right <= this.right)) {
      width = rect.right - x;
   }

   // Top
   if ((this.top >= rect.top) && (this.top < rect.bottom)) {
      y = this.top;
   } else if ((rect.top >= this.top) && (rect.top < this.bottom)) {
      y = rect.top;
   }

   // Bottom
   if ((this.bottom > rect.top) && (this.bottom <= rect.bottom)) {
     height = this.bottom - y;
   } else if ((rect.bottom > this.top) && (rect.bottom <= this.bottom)) {
     height = rect.bottom - y;
   }
   return new Rect(x, y, width, height);
};

/**
 * Join two rectangles
 *
 * @param {gamejs.Rect} union with this rectangle
 * @returns {gamejs.Rect} rectangle containing area of both rectangles
 */
Rect.prototype.union = function(rect) {
   var x, y, width, height;

   x = Math.min(this.left, rect.left);
   y = Math.min(this.top, rect.top);
   width = Math.max(this.right, rect.right) - x;
   height = Math.max(this.bottom, rect.bottom) - y;
   return new Rect(x, y, width, height);
};

/**
 * Grow or shrink the rectangle size
 *
 * @param {Number} amount to change in the width
 * @param {Number} amount to change in the height
 * @returns {gamejs.Rect} inflated rectangle centered on the original rectangle's center
 */
Rect.prototype.inflate = function(x, y) {
    var copy = this.clone();
    
    copy.inflateIp(x, y);

    return copy;
}

/**
 * Grow or shrink this Rect in place - not returning a new Rect like `inflate(x, y)` would.
 *
 * @param {Number} amount to change in the width
 * @param {Number} amount to change in the height
 */
Rect.prototype.inflateIp = function(x, y) {
    // Use Math.floor here to deal with rounding of negative numbers the
    // way this relies on.
    this.left -= Math.floor(x / 2);
    this.top -= Math.floor(y / 2);
    this.width += x;
    this.height += y;
}

/**
 * Check for collision with a point.
 *
 * `collidePoint(x,y)` or `collidePoint([x,y])` or `collidePoint(new Rect(x,y))`
 *
 * @param {Array|gamejs.Rect} point the x and y coordinates of the point to test for collision
 * @returns {Boolean} true if the point collides with this Rect
 */
Rect.prototype.collidePoint = function() {
   var args = normalizeRectArguments.apply(this, arguments);
   return (this.left <= args.left && args.left <= this.right) &&
       (this.top <= args.top && args.top <= this.bottom);
};

/**
 * Check for collision with a Rect.
 * @param {gamejs.Rect} rect the Rect to test check for collision
 * @returns {Boolean} true if the given Rect collides with this Rect
 */
Rect.prototype.collideRect = function(rect) {
   return !(this.left > rect.right || this.right < rect.left ||
      this.top > rect.bottom || this.bottom < rect.top);
};

/**
 * @param {Array} pointA start point of the line
 * @param {Array} pointB end point of the line
 * @returns true if the line intersects with the rectangle
 * @see http://stackoverflow.com/questions/99353/how-to-test-if-a-line-segment-intersects-an-axis-aligned-rectange-in-2d/293052#293052
 *
 */
Rect.prototype.collideLine = function(p1, p2) {
   var x1 = p1[0];
   var y1 = p1[1];
   var x2 = p2[0];
   var y2 = p2[1];

   function linePosition(point) {
      var x = point[0];
      var y = point[1];
      return (y2 - y1) * x + (x1 - x2) * y + (x2 * y1 - x1 * y2);
   }

   var relPoses = [[this.left, this.top],
                   [this.left, this.bottom],
                   [this.right, this.top],
                   [this.right, this.bottom]
                  ].map(linePosition);

   var noNegative = true;
   var noPositive = true;
   var noZero = true;
   relPoses.forEach(function(relPos) {
      if (relPos > 0) {
         noPositive = false;
      } else if (relPos < 0) {
         noNegative = false;
      } else if (relPos === 0) {
         noZero = false;
      }
   }, this);

   if ( (noNegative || noPositive) && noZero) {
      return false;
   }
   return !((x1 > this.right && x2 > this.right) ||
            (x1 < this.left && x2 < this.left) ||
            (y1 < this.top && y2 < this.top) ||
            (y1 > this.bottom && y2 > this.bottom)
            );
};

/**
 * @returns {String} Like "[x, y][w, h]"
 */
Rect.prototype.toString = function() {
   return ["[", this.left, ",", this.top, "]"," [",this.width, ",", this.height, "]"].join("");
};

/**
 * @returns {gamejs.Rect} A new copy of this rect
 */
Rect.prototype.clone = function() {
   return new Rect(this);
};

/**
 * A Surface represents a bitmap image with a fixed width and height. The
 * most important feature of a Surface is that they can be `blitted`
 * onto each other.
 *
 * @example
 * new gamejs.Surface([width, height]);
 * new gamejs.Surface(width, height);
 * new gamejs.Surface(rect);
 * @constructor
 *
 * @param {Array} dimensions Array holding width and height
 */
var Surface = exports.Surface = function() {
   var args = normalizeRectArguments.apply(this, arguments);
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
   this._context = this._canvas.getContext('2d')
   this._smooth();
   return this;
};

/** @ignore */
Surface.prototype._noSmooth = function() {
	// disable image scaling
	// see https://developer.mozilla.org/en/Canvas_tutorial/Using_images#Controlling_image_scaling_behavior
	// and https://github.com/jbuck/processing-js/commit/65de16a8340c694cee471a2db7634733370b941c
	this.context.mozImageSmoothingEnabled = false;
   this.canvas.style.setProperty("image-rendering", "optimizeSpeed", "important");
   this.canvas.style.setProperty("image-rendering", "-moz-crisp-edges", "important");
   this.canvas.style.setProperty("image-rendering", "-webkit-optimize-contrast", "important");
   this.canvas.style.setProperty("image-rendering", "optimize-contrast", "important");
   this.canvas.style.setProperty("-ms-interpolation-mode", "nearest-neighbor", "important");
   return;
};
/** @ignore */
Surface.prototype._smooth = function() {
   this.canvas.style.setProperty("image-rendering", "optimizeQuality", "important");
   this.canvas.style.setProperty("-ms-interpolation-mode", "bicubic", "important");
   this.context.mozImageSmoothingEnabled = true;
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
 * @param {gamejs.Surface} src The Surface which will be blitted onto this one
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
   // first translate, then rotate
   var m = matrix.translate(matrix.identity(), rDest.left, rDest.top);
   m = matrix.multiply(m, src._matrix);
   this.context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
   // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
   this.context.globalAlpha = src._blitAlpha;
   this.context.drawImage(src.canvas, rArea.left, rArea.top, rArea.width, rArea.height, 0, 0, rDest.width, rDest.height);
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
   if ( rect === undefined )
       rect = new Rect(0, 0, this.canvas.width, this.canvas.height);

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
 * @returns {gamejs.Surface} a clone of this surface
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

/**
 * @ignore
 */
exports.display = require('./gamejs/display');
/**
 * @ignore
 */
exports.draw = require('./gamejs/draw');
/**
 * @ignore
 */
exports.event = require('./gamejs/event');
/**
 * @ignore
 */
exports.font = require('./gamejs/font');
/**
 * @ignore
 */
exports.http = require('./gamejs/http');
/**
 * @ignore
 */
exports.image = require('./gamejs/image');
/**
 * @ignore
 */
exports.mask = require('./gamejs/mask');
/**
 * @ignore
 */
exports.mixer = require('./gamejs/mixer');
/**
 * @ignore
 */
exports.sprite = require('./gamejs/sprite');
/**
 * @ignore
 */
exports.surfacearray = require('./gamejs/surfacearray');
/**
 * @ignore
 */
exports.time = require('./gamejs/time');
/**
 * @ignore
 */
exports.transform = require('./gamejs/transform');

/**
 * @ignore
 */
exports.utils = {
   arrays: require('./gamejs/utils/arrays'),
   objects: require('./gamejs/utils/objects'),
   matrix: require('./gamejs/utils/matrix'),
   vectors: require('./gamejs/utils/vectors'),
   math: require('./gamejs/utils/math'),
   uri: require('./gamejs/utils/uri')
};

/**
 * @ignore
 */
exports.pathfinding = {
   astar: require('./gamejs/pathfinding/astar')
};

/**
 * @ignore
 */
exports.worker = require('./gamejs/worker');

/**
 * @ignore
 */
exports.base64 = require('./gamejs/base64');

/**
 * @ignore
 */
exports.xml = require('./gamejs/xml');

/**
 * @ignore
 */
exports.tmx = require('./gamejs/tmx');

// preloading stuff
var gamejs = exports;
var RESOURCES = {};

/**
 * ReadyFn is called once all modules and assets are loaded.
 * @param {Function} readyFn the function to be called once gamejs finished loading
 * @name ready
 */
if (gamejs.worker.inWorker === true) {
   exports.ready = function(readyFn) {
      gamejs.worker._ready();
      gamejs.init();
      readyFn();
   }
} else {
   exports.ready = function(readyFn) {

      var getMixerProgress = null;
      var getImageProgress = null;

      // init time instantly - we need it for preloaders
      gamejs.time.init();

      // 2.
      function _ready() {
         if (!document.body) {
            return window.setTimeout(_ready, 50);
         }
         getImageProgress = gamejs.image.preload(RESOURCES);
         try {
            getMixerProgress = gamejs.mixer.preload(RESOURCES);
         } catch (e) {
            gamejs.debug('Error loading audio files ', e);
         }
         window.setTimeout(_readyResources, 50);
      }

      // 3.
      function _readyResources() {
         if (getImageProgress() < 1 || getMixerProgress() < 1) {
            return window.setTimeout(_readyResources, 100);
         }
         gamejs.display.init();
         gamejs.image.init();
         gamejs.mixer.init();
         gamejs.event.init();
         readyFn();
      }

      // 1.
      window.setTimeout(_ready, 13);

      function getLoadProgress() {
         if (getImageProgress) {
            return (0.5 * getImageProgress()) + (0.5 * getMixerProgress());
         }
         return 0.1;
      }

      return getLoadProgress;
   };
}

/**
 * Initialize all gamejs modules. This is automatically called
 * by `gamejs.ready()`.
 * @returns {Object} the properties of this objecte are the moduleIds that failed, they value are the exceptions
 * @ignore
 */
exports.init = function() {
   var errorModules = {};
   ['time', 'display', 'image', 'mixer', 'event'].forEach(function(moduleName) {
      try {
         gamejs[moduleName].init();
      } catch (e) {
         errorModules[moduleName] = e.toString();
      }
   });
   return errorModules;
}

function resourceBaseHref() {
    return (window.$g && window.$g.resourceBaseHref) || document.location.href;
}

/**
 * Preload resources.
 * @param {Array} resources list of resources paths
 * @name preload
 */
var preload = exports.preload = function(resources) {
   var uri = require('./gamejs/utils/uri');
   var baseHref = resourceBaseHref();
   resources.forEach(function(res) {
      RESOURCES[res] = uri.resolve(baseHref, res);
   }, this);
   return;
};

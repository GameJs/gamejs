var matrix = require('./gamejs/math/matrix');
var objects = require('./gamejs/utils/objects');
var Callback = require('./gamejs/utils/callback').Callback;

/**
 * @fileoverview  `gamejs.ready()` is maybe the most important function as it kickstarts your app:
 *
 *     var gamejs = require('gamejs');
 *     ready(function() {
 *         gamejs.logging.info('I am ready!')
 *     });
 *
 * If you use images or sounds preload all assets with `gamejs.preload(['./files/foo.png'])` before calling `ready()`.
 *
 * Also in this module is the `Rect` class which is generally useful when dealing with Surfaces and simple rectangles (e.g. for collisions).
 */
// preloading stuff
var gamejs = exports;
var RESOURCES = {};
/**
 * @ignore
 */
exports.thread = require('./gamejs/thread');


/**
 * ReadyFn is called once all modules and assets are loaded.
 * @param {Function} callbackFunction the function to be called once gamejs finished loading
 * @name ready
 */
if (gamejs.thread.inWorker === true) {
   exports.ready = function(readyFn) {
      require('./gamejs/thread')._ready();
      gamejs.init();
      readyFn();
   };
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
            getMixerProgress = gamejs.audio.preload(RESOURCES);
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
         gamejs.audio.init();
         gamejs.event.init();
         gamejs.math.random.init();
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
   ['time', 'display', 'image', 'audio', 'event'].forEach(function(moduleName) {
      try {
         gamejs[moduleName].init();
      } catch (e) {
         errorModules[moduleName] = e.toString();
      }
   });
   return errorModules;
};

var resourceBaseHref = function() {
    return (window.$g && window.$g.resourceBaseHref) || document.location.href;
};

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

/**
 * The function passed to `onTick` will continously be called at a
 * frequency determined by the browser (typically between 1 and 60 times per second).
 * @param {Function} callbackFunction the function you want to be called
 * @param {Function} callbackScope optional scope for the function call
 */
exports.onTick = function(fn, scope) {
  /** ignore **/
  exports.time._CALLBACKS.push(new Callback(fn, scope));
};

/**
 * Normalize various ways to specify a Rect into {left, top, width, height} form.
 * @ignore
 *
 */
var normalizeRectArguments = exports.normalizeRectArguments = function () {
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
};


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
 * @constructor
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
         this.bottom = args.top;
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
         this.right = args.left;
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
         this.right = args.left;
         this.bottom = args.top;
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
};

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
};

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
exports.audio = require('./gamejs/audio');
/**
 * @ignore
 */
exports.graphics = require('./gamejs/graphics');

/**
 * @ignore
 */
exports.logging = require('./gamejs/logging');

/**
 * @ignore
 */
exports.math = {
   matrix: require('./gamejs/math/matrix'),
   vectors: require('./gamejs/math/vectors'),
   angles: require('./gamejs/math/angles'),
   binaryheap: require('./gamejs/math/binaryheap'),
   random: require('./gamejs/math/random'),
   noise: require('./gamejs/math/noise'),
};

/**
 * @ignore
 */
exports.utils = {
   arrays: require('./gamejs/utils/arrays'),
   objects: require('./gamejs/utils/objects'),
   uri: require('./gamejs/utils/uri'),
   strings: require('./gamejs/utils/strings'),
   xml: require('./gamejs/utils/xml'),
   base64: require('./gamejs/utils/base64')
};
/**
 * @ignore
 */
exports.display = require('./gamejs/display');
/**
 * @ignore
 */
exports.pathfinding = require('./gamejs/pathfinding');


/**
 * @ignore
 */
exports.tiledmap = require('./gamejs/tiledmap');


/**
 * @ignore
 */
exports.time = require('./gamejs/time');

/**
 * @ignore
 */
exports.pixelcollision = require('./gamejs/pixelcollision');
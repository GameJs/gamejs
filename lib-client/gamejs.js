var matrix = require('gamejs/matrix');

/**
 * @fileoverview This module holds the essential `Rect` and `Surface` classes.
 */

/**
 * Log a msg to the console if console is enable
 * @param {String} msg the msg to log
 */
exports.log = function(msg, lvl) {
   //if (lvl === undefined || DEBUG_LEVEL <= parseInt(lvl)) {
      if (window.console !== undefined) console.log(msg);      
   //} 
};

/**
 * Creates a Rect. Rects are used to hold rectangular areas. There are a couple
 * of convinient ways to create Rects with different arguments and defaults.
 *
 * A Rect has descriptive fields `left, right, top, bottom, width, height`
 * which can all be assigned to.
 *
 * @example
 * new Rect([left, top]) width & height default to 0
 * new Rect(left, top) width & height default to 0
 * new Rect(left, top, width, height)
 * new Rect([left, top], [width, height])
 * 
 * @propert {Number} left
 * @propert {Number} right
 * @propert {Number} top
 * @propert {Number} bottom
 * @propert {Number} bottom
 * 
 * @constructor
 * @class Rects are used a lot. They are good for collision detection, specifying
 *        an area on the screen (for blitting) or just to hold an objects position.
 *
 * @param {Number[]} position Array holding left and top coordinates
 * @param {Number[]} dimensions Array holding width and height
 */
var Rect = exports.Rect = function() {
   /**
    * Left, X coordinate
    * @name Rect.prototype.left
    */
   this.left = 0;
   
   /**
    * Top, Y coordinate
    * @name Rect.prototype.top
    */
   this.top = 0;
   
   /**
    * Width of rectangle
    * @name Rect.prototype.width
    */
   this.width = 0;
   
   /**
    * Height of rectangle
    * @name Rect.prototype.height
    */
   this.height = 0;
   
   if (arguments.length === 2) {
      if (arguments[0] instanceof Array && arguments[1] instanceof Array) {   
         this.left = parseInt(arguments[0][0], 10);
         this.top = parseInt(arguments[0][1], 10);
         this.width = parseInt(arguments[1][0], 10);
         this.height = parseInt(arguments[1][1], 10);
      } else {
         this.left = parseInt(arguments[0], 10);
         this.top = parseInt(arguments[1], 10);
      }
   } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      this.left = parseInt(arguments[0][0], 10);
      this.top = parseInt(arguments[0][1], 10);
      this.width = parseInt(arguments[0][2], 10) || 0;
      this.height = parseInt(arguments[0][3], 10) || 0;
   } else if (arguments.length === 4) {
      this.left = parseInt(arguments[0], 10);
      this.top = parseInt(arguments[1], 10);
      this.width = parseInt(arguments[2], 10);
      this.height = parseInt(arguments[3], 10);
   }
   
   return this;
};

/** 
 * Bottom, Y coordinate
 */
Rect.prototype.__defineGetter__("bottom", function() {
   return this.top + this.height;
});

/** 
 * Right, X coordinate
 */
Rect.prototype.__defineGetter__("right", function() {
   return this.left + this.width;
});

/** 
 * Center Position
 * @type Array
 */
Rect.prototype.__defineGetter__("center", function() {
   return [parseInt(this.left + (this.width / 2), 10), 
           parseInt(this.top + (this.height / 2), 10)
          ];
});

Rect.prototype.__defineSetter__("center", function(center) {
   if (!typeof(center) === 'array' || center.length < 2) {
      throw new Error('tried to set center of ' + this + ' to non array' + center);
   }
   this.left = parseInt(center[0] - (this.width / 2), 10);
   this.top = parseInt(center[1] - (this.height / 2), 10);
   return;
});

/**
 * Move returns a new Rect, which is a version of this Rect
 * moved by the given amounts.
 * @param {Number} x amount to move on x axis
 * @param {Number} y amount to move on y axis
 */
Rect.prototype.move = function(x, y) {
   return new Rect(this.left+x, this.top+y, this.width, this.height);
};

/**
 * Move this Rect in place - not returning a new Rect like `move(x, y)`.
 *
 * `moveIp(x,y)` or `moveIp([x,y])`
 *
 * @param {Number} x amount to move on x axis
 * @param {Number} y amount to move on y axis
 */
Rect.prototype.moveIp = function(x, y) {
   if (arguments.length == 1) {
      x = parseInt(arguments[0][0], 10);
      y = parseInt(arguments[0][1], 10);
   }
   this.left += x;
   this.top += y;
};

/**
 * Check for collision with a point.
 *
 * `collidePoint(x,y)` or `collidePoint([x,y])` or `collidePoint(new Rect(x,y))`
 *
 * @param {Number[]} point the x and y coordinates of the point to test for collision
 * @returns {Boolean} true if the point collides with this Rect
 */
Rect.prototype.collidePoint = function() {
   var x,y;
   // FIXME must accept rect constructor forms
   if (arguments.length == 1 && arguments[0] instanceof Rect) {
      x = arguments[0].left;
      y = arguments[0].top;
   } else if (arguments.length == 1) {
      x = parseInt(arguments[0][0], 10);
      y = parseInt(arguments[0][1], 10);
   } else {
      x = parseInt(arguments[0], 10)
      y = parseInt(arguments[1], 10);
   }
   return (this.left <= x && x <= this.right) &&
       (this.top <= y && y <= this.bottom)   
};

/**
 * Check for collision with a Rect.
 * @param {gamejs.Rect} rect the Rect to test check for collision
 * @returns {Boolean} true if the given Rect collides with this Rect
 */   
Rect.prototype.collideRect = function(rect) {
   // FIXME must accept rect constructor forms
   return !(this.left > rect.right || this.right < rect.left ||
      this.top > rect.bottom || this.bottom < rect.top);
};

/** 
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
      var x = point[0]
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
      if (relPos > 0) noPositive = false;
      if (relPos < 0) noNegative = false;
      if (relPos === 0) noZero = false;
   }, this);
   
   if ( (noNegative || noPositive) && noZero) {
      return false;
   }
   return !((x1 > this.right && x2 > this.right) ||
            (x1 < this.left && x2 < this.left) ||
            (y1 < this.top && y2 < this.top) ||
            (y1 > this.bottom && y2 > this.bottom)
            );
}


Rect.prototype.toString = function() {
   return ["[", this.left, ",", this.top, "]"," [",this.width, ",", this.height, "]"].join("");
}

/**
 * Creates a Surface. A Surface represents an image with a fixed width and height.
 * Surfaces can be <code>blit()</code>ed (copied) onto other Surfaces.
 *
 * @example
 * new gamejs.Surface([width, height]);
 * new gamejs.Surface(width, height);
 *
 * @constructor
 *
 * @param {Number[]} dimensions Array holding width and height
 */
var Surface = exports.Surface = function(dims) {
   if (arguments.length == 2) {
      dims = [arguments[0], arguments[1]];
   } else if (arguments.length == 1 && dims instanceof Rect) {   
      dims = [dims.width, dims.height];
   }
   var width = dims[0];
   var height = dims[1];
   // only for rotatation & scale
   this._matrix = matrix.identity();
	this._canvas = document.createElement("canvas");
	this._canvas.width = width;
	this._canvas.height = height;
   return this;
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
 * @param {gamejs.Rect|Number[]} [dst] the Destination x, y position in this Surface.
 *            If a Rect is given, it's top and left values are taken. If this argument
 *            is not supplied the blit happens at [0,0].
 * @param {gamesjs.Rect|Number[]} [area] the Area from the passed Surface which
 *            should be blitted onto this Surface.
 * @param {Number} [special_flags] FIXME add special flags for blit params
 */
Surface.prototype.blit = function(src, dest, area, special_flags) {

   var rDest, rArea;
   
   // dest, we only care about x, y
   if (dest instanceof Rect) {
      rDest = dest; // new gamejs.Rect([dest.left, dest.top], src.getSize());
      var srcSize = src.getSize();
      if (!rDest.width) rDest.width = srcSize[0];
      if (!rDest.height) rDest.height = srcSize[1];
    } else if (dest && dest instanceof Array && dest.length == 2) {
      rDest = new Rect(dest, src.getSize());
    } else {
      rDest = new Rect([0,0], src.getSize());
    }
   
   // area within src to be drawn
   if (area instanceof Rect) {
      rArea = area;
   } else if (area && area instanceof Array && area.length == 2) {
      rArea = new Rect(area, src.getSize());
   } else {
      rArea = new Rect([0,0], src.getSize());
   }

   if (isNaN(rDest.left) || isNaN(rDest.top) || isNaN(rDest.width) || isNaN(rDest.height)) {
      throw new Error('[blit] bad parameters, destination is ' + rDest);
   }
   
   this.context.save();
   // first translate, then rotate
   var m = matrix.translate(matrix.identity(), rDest.left, rDest.top);
   m = matrix.multiply(m, src._matrix);
   this.context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
   srcRect = src.getRect();
   // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
   this.context.drawImage(src.canvas, rArea.left, rArea.top, rArea.width, rArea.height, 0, 0, rDest.width, rDest.height)
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
 * @param {String} color an #RGB string, e.g., #00ff00
 */
// rgb css color
Surface.prototype.fill = function(color) {
   this.context.save();
   this.context.fillStyle = color || "#000000";
   this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
   this.context.restore();
   return;
};

Surface.prototype.clear = function() {
   var size = this.getSize();
   this.context.clearRect(0, 0, size[0], size[1]);
   return;
};


Surface.prototype.__defineGetter__("rect", function() {
   return this.getRect();
});

/**
 * @ignore
 */
Surface.prototype.__defineGetter__('context', function() { 
   return this._canvas.getContext('2d');
});

/**
 * @ignore
 */
Surface.prototype.__defineGetter__('canvas', function() {
   return this._canvas;
});


// FIXME get rid of this, currently required by all apps
/**
 * @ignore
 */
exports.utils = {};
/**
 * @ignore
 */
exports.utils.arrays = require('gamejs/utils/arrays');
/**
 * @ignore
 */
exports.utils.objects = require('gamejs/utils/objects');

/**
 * @ignore
 */
exports.event = require('gamejs/event');
/**
 * @ignore
 */
exports.time = require('gamejs/time');
/**
 * @ignore
 */
exports.matrix = require('gamejs/matrix');
/**
 * @ignore
 */
exports.transform = require('gamejs/transform');
/**
 * @ignore
 */
exports.image = require('gamejs/image');
/**
 * @ignore
 */
exports.draw = require('gamejs/draw');
/**
 * @ignore
 */
exports.sprite = require('gamejs/sprite');
/**
 * @ignore
 */
exports.display = require('gamejs/display');
/**
 * @ignore
 */
exports.font = require('gamejs/font');
/**
 * @ignore
 */
exports.mixer = require('gamejs/mixer');
/**
 * @ignore
 */
exports.scene = require('gamejs/scene');
/**
 * @ignore
 */
exports.iso = require('gamejs/iso');
/**
 * @ignore
 */
exports.network = {};
/**
 * @ignore
 */
exports.network.client = require('gamejs/network/client');


// preloading stuff
// NEEDS ITS OWN COPY OF GAMEJS
var gamejs = require('gamejs');
var RESOURCES = {};

/**
 * FIXME          // need to be updated to new {key, uri} resource idents
 * delegate resource loading if module loaded
 */
var loadResources = function(file) {
   if (RESOURCES.length) {

         /*
         .filter(function(ident) {
            if (fname.indexOf('png') > -1 || fname.indexOf('jpg') > -1 || fname.indexOf('gif') > -1)
               return true;
            return false;
         }));
         gamejs.mixer.preload(RESOURCES.filter(function(fname) {
            if (fname.indexOf('ogg') > -1 || fname.indexOf('wav') > -1)
               return true;
            return false;
         }));
         */
   }
   return;
};

/**
 * ReadyFn is called once all modules and assets are loaded.
 * @param {Function} readyFn the function to be called once gamejs finished loading
 * @name ready
 */
exports.ready = function(readyFn) {
   // 2.
   var _ready = function() {
      if (!document.body) {
         return window.setTimeout(_ready, 13);
      }
      gamejs.image.preload(RESOURCES);
      window.setTimeout(_readyResources, 13);
   }
   // 3.
   var _readyResources = function() {
      if (gamejs.image.isPreloading() || gamejs.mixer._PRELOADING) {
         return window.setTimeout(_readyResources, 13);
      }
      gamejs.time.init();
      gamejs.display.init();
      gamejs.image.init();
      gamejs.mixer.init();
      gamejs.event.init();
      readyFn();
   }
   
   // 1.
   window.setTimeout(_ready, 13);
   return;
};

/**
 * Preload resources.
 * @param {Array} resources list of resources paths
 * @name preload
 */
var preload = exports.preload = function(resources) {
   // attack appBaseUrl to resources
   resources.forEach(function(res) {
      // normalize slashses
      RESOURCES[res] = ($g.resourceBaseHref + '/' + res).replace(/\/+/g, '/');
   }, this);
   return;
}

exports.preloadAnimation = function(animationKey, animations, meta) {
   // FIXME fns duplicated in gamejs.iso
   function getImagePath(root, animation) {
      return root + animation.replace(' ', '%20') + '.png';
   }

   var images = [];
   for (var animation in animations) {
      images.push(getImagePath(meta.rootPath, animation));
   }
   preload(images);
   // FIXME store them somewhere & make accessible per name
   window.$G_ANIMATIONS[animationKey] = {
      meta: meta,
      animations: animations,
   }
}

// serverside shim

if (this.window) {
   window.$G_ANIMATIONS = {};
}


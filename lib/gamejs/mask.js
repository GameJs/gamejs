var gamejs = require('gamejs');

/**
 * @fileoverview Image masks. Usefull for pixel perfect collision detection.
 */

/**
 * Creates an image mask from the given Surface. The alpha of each pixel is checked
 * to see if it is greater than the given threshold. If it is greater then
 * that pixel is set as non-colliding.
 *
 * @param {gamejs.Surface} surface
 * @param {Number} threshold 0 to 255. defaults to: 255, fully transparent
 */
exports.fromSurface = function(surface, threshold) {
   var threshold = threshold && (255 - threshold) || 255;
   var imgData = surface.getImageData();
   var dims = surface.getSize()
   var mask = new Mask(dims);
   for (var i=0;i<imgData.length;i += 4) {
      var y = parseInt((i / 4) / dims[1], 10);
      var x = parseInt((i / 4) % dims[0], 10);
      var alpha = imgData[i+3];
      if (alpha >= threshold) {
         mask.setAt(x, y);
      }
   };
   return mask;
};

/**
 * Image Mask
 * @param {Array} dimensions [width, height]
 *
 */
var Mask = exports.Mask = function(dims) {
   this.width = dims[0];
   this.height = dims[1];
   this._bits = [];
   for (var i=0;i<this.height;i++) {
      this._bits[i] = [];
      for (var j=0;j<this.width;j++) {
         this._bits[i][j] = false;
      }
   };
   return;
};

/**
 *
 * @returns True if the otherMask overlaps with this map.
 * @param {Mask} otherMask
 * @param {Array} offset
 */
Mask.prototype.overlap = function(otherMask, offset) {
   var arect = this.rect;
   var brect = otherMask.rect;
   brect.moveIp(offset);

   // bounding box intersect
   if (!brect.collideRect(arect)) {
      return false;
   };

   var xStart = Math.max(arect.left, brect.left);
   var xEnd = Math.min(arect.right, brect.right);

   var yStart = Math.max(arect.top, brect.top);
   var yEnd = Math.min(arect.bottom, brect.bottom);

   for (var y=yStart; y<=yEnd; y++) {
      for (var x=xStart; x<=xEnd; x++) {
         if (this.getAt(x - arect.left, y - arect.top) &&
             otherMask.getAt(x - brect.left, y - brect.top)) {
             return true;
         }
      };
   };
   return false;
};

/**
 * Set bit at position.
 * @param {Number} x
 * @param {Number} y
 */
Mask.prototype.setAt = function(x, y) {
   this._bits[x][y] = true;
};

/**
 * Get bit at position.
 *
 * @param {Number} x
 * @param {Number} y
 */
Mask.prototype.getAt = function(x, y) {
   if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;

   return this._bits[x][y];
};


/**
 * Flip the bits in this map.
 */
Mask.prototype.invert = function() {
   this._bits = this._bits.map(function(row) {
      return row.map(function(b) {
         return !b;
      });
   });
};

/**
 * Rect of this Mask.
 */
Mask.prototype.__defineGetter__('rect', function() {
   return new gamejs.Rect([0, 0], [this.width, this.height]);
});

/**
 * @returns {Array} the dimensions of the map
 */
Mask.prototype.getSize = function() {
   return [this.width, this.height];
};

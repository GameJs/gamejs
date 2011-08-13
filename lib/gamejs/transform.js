var Surface = require('../gamejs').Surface;
var matrix = require('./utils/matrix');
var math = require('./utils/math');
var vectors = require('./utils/vectors');

/**
 * @fileoverview Rotate and scale Surfaces.
 */

/**
 * Returns a new surface which holds the original surface rotate by angle degrees.
 * @param {Surface} surface
 * @param {angel} angle Clockwise angle by which to rotate
 * @returns {Surface} new, rotated surface
 */
exports.rotate = function (surface, angle) {
   var origSize = surface.getSize();
   var radians = (angle * Math.PI / 180);
   var newSize = origSize;
   // find new bounding box
   if (angle % 90 !== 0) {
      var rect = surface.getRect();
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
   var oldMatrix = surface._matrix;
   surface._matrix = matrix.translate(surface._matrix, origSize[0]/2, origSize[1]/2);
   surface._matrix = matrix.rotate(surface._matrix, radians);
   surface._matrix = matrix.translate(surface._matrix, -origSize[0]/2, -origSize[1]/2);
   var offset = [(newSize[0] - origSize[0]) / 2, (newSize[1] - origSize[1]) / 2]
   newSurface.blit(surface, offset);
   surface._matrix = oldMatrix;
   return newSurface;
};

/**
 * Returns a new surface holding the scaled surface.
 * @param {Surface} surface
 * @param {Array} scale new [widthScale, heightScale] in range; e.g.: [2,2] would double the size
 * @returns {Surface} new, scaled surface
 */
exports.scale = function(surface, dims) {
   var width = dims[0];
   var height = dims[1];
   var newDims = surface.getSize();
   newDims = [newDims[0] * dims[0], newDims[1] * dims[1]];
   var newSurface = new Surface(newDims);
   surface._matrix = matrix.scale(surface._matrix, [width, height]);
   newSurface.blit(surface);
   return newSurface;
};

/**
 * Flip a Surface either vertically, horizontally or both. This returns
 * a new Surface (i.e: nondestructive).
 * @param {gamejs.Surface} surface
 */
exports.flip = function(surface, flipHorizontal, flipVertical) {
   var dims = surface.getSize();
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
   newSurface.context.drawImage(surface.canvas, xPos, yPos);
   newSurface.context.restore();
   return newSurface;
};

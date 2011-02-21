var Surface = require('gamejs').Surface;
var matrix = require('gamejs/utils/matrix');

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
   // degrees
   // FIXME the size of the new surface should be increased if the rotation requires taht
   var origSize = surface.getSize();
   var newSurface = new Surface(origSize);
   var oldMatrix = surface._matrix;
   surface._matrix = matrix.translate(surface._matrix, origSize[0]/2, origSize[1]/2);
   surface._matrix = matrix.rotate(surface._matrix, (angle * Math.PI / 180));
   surface._matrix = matrix.translate(surface._matrix, -origSize[0]/2, -origSize[1]/2);
   newSurface.blit(surface);
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
   newSurface._matrix = matrix.scale(newSurface._matrix, [width, height]);
   newSurface.blit(surface);
   return newSurface;
};

var gamejs = require('gamejs');
var accessors = require('gamejs/utils/objects').accessors;
/**
 * @fileoverview Fast pixel access.
 */ 

/**
 * The SurfaceArray can be constructed with a surface whose values
 * are then used to initialize the pixel array.
 *
 * The surface passed as argument is not modified by the SurfaceArray.
 *
 * If an array is used to construct SurfaceArray, the array must describe
 * the dimensions of the SurfaceArray [width, height].
 *
 * @param {gamejs.Surface|Array} surfaceOrDimensions
 * @see http://dev.w3.org/html5/2dcontext/#pixel-manipulation
 */
var SurfaceArray = exports.SurfaceArray = function(surfaceOrDimensions) {

   /*
    * Set rgba value at position x, y.
    * 
    * For performance reasons this function has only one signature
    * being Number, Number, Array[4].
    * 
    * @param {Number} x x position of pixel
    * @param {Number} y y position of pixel
    * @param {Array} rgba [red, green, blue, alpha] values [255, 255, 255, 1] (alpha, last argument: defaults to 0)
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
      data[offset+3] = rgba[3] ||  255;
      return;
   };

   /**
    * Get rgba value at position xy,
    * @param {Number}
    * @param {Number}
    * @returns {Array} [red, green, blue, alpha]
    */   
   this.get = function(x, y) {
      var offset = (x * 4) + (y * size[0] * 4);
      return [
         data[offset],
         data[offset+1],
         data[offset+2],
         data[offset+3]
      ]
   };

   /**
    * @returns a new gamejs.Surface on every access, representing
    * the current state of the SurfaceArray.
    */
   accessors(this, {
      image: {
         get: function() {
            var s = new gamejs.Surface(size);
            s.context.putImageData(imageData, 0, 0);
            return s;
         }
      }
   });
   
   /**
    * This is a faster way to get the pixel data as a Surface, if you already
    * have a Surface on which SurfaceArray can put the data onto.
    *
    * @returns {Surface} blits the image data onto the passed surface and returns the surface
    */
   this.getImage = function(surface) {
      surface.context.putImageData(imageData, 0, 0);
      return surface;
   };
   
   /**
    * constructor
    */
   var size = null;
   var data = null;
   var imageData = null;
   if (surfaceOrDimensions instanceof Array) {
      size = surfaceOrDimensions;
      imageData = gamejs.display.getSurface().context.createImageData(size[0], size[1]);
   } else {
      size = surfaceOrDimensions.getSize();
      imageData = surfaceOrDimensions.context.getImageData(0, 0, size[0], size[1]);
   }
   data = imageData.data;
   return this;
};

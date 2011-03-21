var gamejs = require('gamejs');

/**
 * @fileoverview Load images as Surfaces.
 * All images must be preloaded:
 *
 *     gamejs.preload(["images/ship.png", "images/sunflower.png"]);
 *
 * and can then be loaded as Surfaces with [gamejs.image.load](#load).
 *
 */

var CACHE = {};
var TOTAL_IMGS = 0;
/**
 * need to export preloading status for require
 * @ignore
 */
var _PRELOADING = false;

/**
 * Load image and return it on a Surface.
 *
 * **Preloading**
 *
 * All images must be preloaded like this:
 *
 *     gamejs.preload(["./images/ship.png", "./images/sunflower.png"]);
 *
 * before they can be used within the gamejs.ready() callback.
 *
 * **Used Resources**
 *
 * This creates a new canvas DOM element each time it is called.
 *
 * @param {String|dom.Image} uriOrImage resource uri for image or the image as a DOM Element (e.g. from <img>)
 * @returns {gamejs.Surface} surface with the image on it.
 */
exports.load = function(key) {
   var img;
   if (typeof key === 'string') {
      img = CACHE[key];
      if (!img) {
         // TODO sync image loading
			throw new Error('Missing "' + key + '", gamejs.preload() all images before trying to load them.');
      }
   } else {
      img = key;
   }
   var canvas = document.createElement('canvas');
   // IEFIX missing html5 feature naturalWidth/Height
   canvas.width = img.naturalWidth || img.width;
   canvas.height = img.naturalHeight || img.height;
   var context = canvas.getContext('2d');
   //context.fillStyle = "#00ff00";
   //context.fillRect(0, 0, canvas.width, canvas.height);
   context.drawImage(img, 0, 0)
   img.getSize = function() { return [img.naturalWidth, img.naturalHeight]; };
   var surface = new gamejs.Surface(img.getSize());
   // NOTE hack setting _canvas directly, don't do this yourself
   surface._canvas = canvas;
   return surface;
};


/**
 * add all images on the currrent page into cache
 * @ignore
 */
exports.init = function() {
   return;
};

/**
 * preload the given img URIs
 * @ignore
 */
exports.preload = function(imgIdents) {

   var countLoaded = 0;

   var incrementLoaded = function() {
      countLoaded++;
      if (countLoaded == TOTAL_IMGS) {
         _PRELOADING = false;
      }
      if (countLoaded % 10 == 0) {
         gamejs.log('loaded  ' + countLoaded + ' of ' + TOTAL_IMGS);
      }
   };
   for (var key in imgIdents) {
      if (key.indexOf('png') == -1 && key.indexOf('jpg') == -1 && key.indexOf('gif') == -1) {
         continue;
      }
      TOTAL_IMGS++;
      var img = new Image();
      img.addEventListener('load',function() {
         addToCache(this);
         incrementLoaded();
         return;
      }, true);
      img.addEventListener('error', function() {
         incrementLoaded();
      	throw new Error('Error loading ' + this.src);
         return;
      }, true);
      img.src = imgIdents[key];
      img.gamejsKey = key;
   }
   if (TOTAL_IMGS > 0) {
      _PRELOADING = true;
   }
   return;
};

/**
 * @ignore
 */
exports.isPreloading = function() {
   return _PRELOADING;
}

/**
 * add the given <img> dom elements into the cache.
 * @private
 */
var addToCache = function(img) {
   CACHE[img.gamejsKey] = img;
   return;
};

var gamejs = require('gamejs');

/**
 * @fileoverview Load images as Surfaces.
 * All images must be preloaded like this:
 *     gamejs.preload(["images/ship.png", "images/sunflower.png"]);
 * and can then be loaded as Surfaces with [gamejs.image.load](#load).
 *
 * The following would load the image and put it onto the screen at position [10,10]:
 *     var ship = gamejs.image.load("images/ship.png");
 *     displaySurface.blit(ship, [10,10]);
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
 * **Note**
 *
 * All images must be preloaded like this:
 *
 *     gamejs.preload(["./images/ship.png", "./images/sunflower.png"]);
 *
 * before they can base used within the gamejs.ready() callback.
 *
 * @param {String|dom.Image} uriOrImage ressource uri for image or the image as Dom Element (e.g. from <img>)
 * @returns {gamejs.Surface} surface with the image on it.
 */
exports.load = function(key) {
   var img;
   if (typeof key === 'string') {
      img = CACHE[key];
      if (!img) {
         // FIXME sync image loading
			gamejs.log('[image] not in cache ' + key);
			throw new Error('could not load image');
      }
   } else {
      img = key;
   }
   var canvas = document.createElement('canvas');
   canvas.width = img.naturalWidth;
   canvas.height = img.naturalHeight;
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
      TOTAL_IMGS++;
      var img = new Image();
      img.addEventListener('load',function() {
         addToCache(this);
         incrementLoaded();
         return;
      }, true);
      img.addEventListener('error', function() {
      	gamejs.log('[image] failed to load ' + this.src);
         incrementLoaded();
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

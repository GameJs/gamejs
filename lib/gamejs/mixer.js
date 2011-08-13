var gamejs = require('../gamejs');

/**
 * @fileoverview Playing sounds with the html5 audio tag. Audio files must be preloaded
 * with the usual `gamejs.preload()` function. Ogg, wav and webm supported.
 *
 * Sounds & Images are loaded relative to './'. You can change that, by setting
 * $g.resourceBaseHref in your page *before* loading the GameJs modules:
 *
 *     <script>
 *     var $g = {
 *        resourceBaseHref: 'http://example.com/resources/'
 *     }
 *     </script>
 *     <script src="./gamejs-wrapped.js"></script>
 *     ....
 *
 * **Note**: sound doesn't work very well across browsers yet. Firefox is best, but all still have
 * bugs.
 */

var CACHE = {};

/**
 * need to export preloading status for require
 * @ignore
 */
var _PRELOADING = false;

/**
 * put all audios on page in cache
 * if same domain as current page, remove common href-prefix
 * @ignore
 */
exports.init = function() {
   var audios = Array.prototype.slice.call(document.getElementsByTagName("audio"), 0);
   addToCache(audios);
   return;
};

/**
 * Preload the audios into cache
 * @param {String[]} List of audio URIs to load
 * @returns {Function} which returns 0-1 for preload progress
 * @ignore
 */
exports.preload = function(audioUrls, showProgressOrImage) {
   var countTotal = 0;
   var countLoaded = 0;

   function incrementLoaded() {
      countLoaded++;
      if (countLoaded == countTotal) {
         _PRELOADING = false;
      }
   }

   function getProgress() {
      return countTotal > 0 ? countLoaded / countTotal : 1;
   }

   function successHandler() {
      addToCache(this);
      incrementLoaded();
   }
   function errorHandler() {
      incrementLoaded();
      throw new Error('Error loading ' + this.src);
   }

   for (var key in audioUrls) {
      if (key.indexOf('wav') == -1 && key.indexOf('ogg') == -1 && key.indexOf('webm') == -1) {
         continue;
      }
      countTotal++;
      var audio = new Audio();
      audio.addEventListener('canplay', successHandler, true);
      audio.addEventListener('error', errorHandler, true);
      audio.src = audioUrls[key];
      audio.gamejsKey = key;
      audio.load();
   }
   if (countTotal > 0) {
      _PRELOADING = true;
   }
   return getProgress;
};

/**
 * @ignore
 */
exports.isPreloading = function() {
   return _PRELOADING;
};

/**
 * @param {dom.ImgElement} audios the <audio> elements to put into cache
 * @ignore
 */
function addToCache(audios) {
   if (!(audios instanceof Array)) {
      audios = [audios];
   }

   var docLoc = document.location.href;
   audios.forEach(function(audio) {
      CACHE[audio.gamejsKey] = audio;
   });
   return;
}

/**
 * Sounds can be played back.
 * @constructor
 * @param {String|dom.AudioElement} uriOrAudio the uri of <audio> dom element
 *                of the sound
 */
exports.Sound = function Sound(uriOrAudio) {
   var cachedAudio;
   if (typeof uriOrAudio === 'string') {
      cachedAudio = CACHE[uriOrAudio];
   } else {
      cachedAudio = uriOrAudio;
   }
   if (!cachedAudio) {
      // TODO sync audio loading
      throw new Error('Missing "' + uriOrAudio + '", gamejs.preload() all audio files before loading');
   }

   var audio = new Audio();
   audio.preload = "auto";
   audio.loop = false;
   audio.src = cachedAudio.src;
   /**
    * start the sound
    */
   this.play = function() {
      if (audio.ended || audio.paused) {
         audio.play();
      }
   };

   /**
    * Stop the sound
    */
   this.stop = function() {
      audio.pause();
   };

   /**
    * Set volume of this sound
    * @param {Number} value volume from 0 to 1
    */
   this.setVolume = function(value) {
      audio.volume = value;
   };

   /**
    * @returns {Number} the sound's volume from 0 to 1
    */
   this.getVolume = function() {
      return audio.volume;
   };

   /**
    * @returns {Number} Duration of this sound in seconds
    */
   this.getLength = function() {
      return audio.duration;
   };

   return this;
};

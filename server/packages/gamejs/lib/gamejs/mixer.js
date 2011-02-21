var gamejs = require('gamejs');

/**
 * @fileoverview Playing sounds with the html5 audio tag. Audio files must be preloaded
 * with the usual `gamejs.preload()` function. Only ogg files supported.
 */

var CACHE = {};

/**
 * need to export preloading status for require
 * @ignore
 */
var _PRELOADING = false

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
 * @ignore
 */
exports.preload = function(audioUrls, showProgressOrImage) {
   var TOTAL_SOUNDS = 0;
   var countLoaded = 0;

   var incrementLoaded = function() {
      countLoaded++;
      if (countLoaded == TOTAL_SOUNDS) {
         _PRELOADING = false;
      }
   };

   for (var key in audioUrls) {
      if (key.indexOf('wav') == -1 && key.indexOf('ogg') == -1) {
         continue;
      }
      TOTAL_SOUNDS++;
      var audio = new Audio();
      audio.addEventListener('canplay', function() {
         addToCache(this);
         incrementLoaded();
         return;
      }, true);
      audio.addEventListener('error', function() {
         gamejs.log('[mixer] failed to load ' + this);
         incrementLoaded();
         return;
      }, true);
      audio.src = audioUrls[key];
      audio.gamejsKey = key;
      audio.load();
   }
   if (TOTAL_SOUNDS > 0) {
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
 * @param {dom.ImgElement} audios the <audio> elements to put into cache
 * @ignore
 */
var addToCache = function(audios) {
   if (!(audios instanceof Array)) audios = [audios];

   var docLoc = document.location.href;
   audios.forEach(function(audio) {
      CACHE[audio.gamejsKey] = audio;
   });
   return;
};

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
      // FIXME sync audio loading
      throw "audio sync loading not support; precache to play";
   }

   var audio = new Audio();
   audio.preload = "auto";
   audio.loop = "false";
   audio.src = cachedAudio.src;
   /**
    * start the sound
    */
   this.play = function() {
      if (audio.ended || audio.paused) {
         audio.play();
      }
   }

   /**
    * Stop the sound
    */
   this.stop = function() {
      audio.pause();
   }

   /**
    * Set volume of this sound
    * @param {Number} value volume from 0 to 1
    */
   this.setVolume = function(value) {
      audio.volume = value;
   }

   /**
    * @returns {Number} the sound's volume from 0 to 1
    */
   this.getVolume = function() {
      return audio.volume;
   }

   /**
    * @returns {Number} Duration of this sound in seconds
    */
   this.getLength = function() {
      return audio.duration;
   };

   return this;
};

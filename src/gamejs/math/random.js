/**
 * @fileoverview A seedable random-number generator.
 *
 * A generator is initialized by GameJs and can be used with the
 * static functions of this module:
 *
 *    gamejs.random.choose([1,2,4]);
 *    // integet between and including 2 and 5
 *    gamejs.random.integer(2, 5);
 *
 * You can re-initialize this generator with a different seed by
 * calling `gamejs.utils.prng.init(seed)` after which the static
 * functions in this module will use the new seed.
 *
 * @usage
 *  var prng = require('gamejs/math/random');
 *  prng.random(); // 0.6765871671959758
 *  prng.integer(2, 10); // 5
 *  prng.choose([1,2,3,4,5]); // 3
 */
// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010
// API modified by Simon Oberhammer <simon@nekapuzer.at>, 2012
// discussion of the used algorithms <http://baagoe.org/en/w/index.php/Better_random_numbers_for_javascript>


/** @ignore **/
var Mash = function Mash() {
  var n = 0xefc8249d;
  this.hash = function(data) {
    data = data.toString();
    var i;
    for (i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  this.version = 'Mash 0.9';
  return this;
};

/**
 * A seedable pseudo-random number generator.
 * @param {Number|String} seed the seed for generating the numbers
 *
 * @usage
 *  var prng = require('gamejs/math/random');
 *  var seed = 'gamejs';
 *  var alea = new prng.Alea(seed);
 *  alea.random(); // 0.6765871671959758
 *  alea.random(); // 0.15881546027958393
 *
 *  // generator with the same seed will generate the same sequence
 *  // of numbers:
 *  var aleaTwo = new prng.Alea(seed);
 *  aleaTwo.random(); // 0.6765871671959758
 *  aleaTwo.random(); // 0.15881546027958393
 */
var Alea = exports.Alea = function Alea() {
   var args = Array.prototype.slice.call(arguments);
   var s0 = 0;
   var s1 = 0;
   var s2 = 0;
   var c = 1;
   if (args.length === 0 || !args[0]) {
     args = [Date.now()];
   }
   var mash = new Mash();
   s0 = mash.hash(' ');
   s1 = mash.hash(' ');
   s2 = mash.hash(' ');

   var i;
   for (i = 0; i < args.length; i++) {
     s0 -= mash.hash(args[i]);
     if (s0 < 0) {
       s0 += 1;
     }
     s1 -= mash.hash(args[i]);
     if (s1 < 0) {
       s1 += 1;
     }
     s2 -= mash.hash(args[i]);
     if (s2 < 0) {
       s2 += 1;
     }
   }
   mash = null;

   /**
    * @returns {Number} the next random number as determined by the seed
    */
   this.random = function() {
     var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
     s0 = s1;
     s1 = s2;
     s2 = t - (c = t | 0);
     return s2;
   };
   this.integer = function(min, max) {
     return min + parseInt(this.random() * (max-min+1), 10);
   };
   this.vector = function(min, max) {
      return [this.integer(min[0], max[0]), this.integer(min[1], max[1])];
   };
   this.choose = function(items) {
      return items[this.integer(0, items.length-1)];
   };
   return this;
};

// alea instance per gamejs instance
var alea = null;

/**
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} random integer between min and max
 */
var integer = exports.integer = function(min, max){
    return alea.integer(min, max);
};

/**
 * @param {Array} minVector 2 integers, the minimum vector
 * @param {Array} maxVector 2 integers, the maximum vector
 * @returns {Array} a random vector [min[0]<=x<=max[0], min[1]<=y<=max[1]]
 */
exports.vector = function(min, max){
    return alea.vector(min, max);
};

/**
 * @param {Array} items
 * @returns {Object} random item from items list
 */
exports.choose = function(items){
    return alea.choose(items);
};

/**
 * @returns {Number} next random float between 0 and 1
 */
exports.random = function() {
  return alea.random();
};

/**
 * Re-initialize the per instance random number generator used
 * in the static functions on this module (e.g. vector())
 * @param {Number|String} seed
 */
exports.init = function(seed) {
  alea = new Alea(seed);
};
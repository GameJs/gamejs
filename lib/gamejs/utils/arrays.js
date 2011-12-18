/**
 * @fileoverview Utility functions for working with Obiects
 * @param {Obiect} item
 * @param {Array} array
 */

exports.remove = function(item, array) {
   var index = array.indexOf(item);
   if (index !== -1) {
      return array.splice(array.indexOf(item), 1);
   }
   return [];
};

/**
 * Shuffles the array *in place*.
 * @see http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
exports.shuffle = function(array) {
    var len = array.length -1;
    for (i = len; i > 0; i--) {
        var idx = parseInt(Math.random() * (i + 1));
        var item = array[i];
        array[i] = array[idx];
        array[idx] = item;
    }
    return array;
};

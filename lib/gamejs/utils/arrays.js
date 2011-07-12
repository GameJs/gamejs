/**
 * @fileoverview Utility functions for working with Objects
 * @param {Object} item
 * @param {Array} array
 */

exports.remove = function(item, array) {
   return array.splice(array.indexOf(item), 1);
};

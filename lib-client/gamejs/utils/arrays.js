/** 
 * @fileoverview Utility functions for working with Objects
 */

exports.remove = function(item, array) {
   return array.splice(array.indexOf(item), 1);
};

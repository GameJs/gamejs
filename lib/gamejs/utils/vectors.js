var math=require('./math');

/**
 * @param {Array} origin point [b0, b1]
 * @param {Array} target point [b0, b1]
 * @returns {Number} distance between two points
 */
exports.distance = function(a, b) {
   return len(subtract(a, b));
};

/**
 * subtracts vectors [a0, a1] - [a0, a1]
 * @param {Array} a
 * @param {Array} b
 * @returns {Array} vector
 */
var subtract = exports.subtract = function(a, b) {
   return [a[0] - b[0], a[1] - b[1]];
};

/**
 * adds vectors [a0, a1] - [a0, a1]
 * @param {Array} a vector
 * @param {Array} b vector
 * @returns {Array} vector
 */
var add = exports.add = function(a, b) {
   return [a[0] + b[0], a[1] + b[1]];
};

/**
 * multiply vector with scalar or other vector
 * @param {Array} vector [v0, v1]
 * @param {Number|Array} vector or number
 * @returns {Number|Array} result
 */
var multiply = exports.multiply = function(a, s) {
   if (typeof s === 'number') {
      return [a[0] * s, a[1] * s];
   }

   return [a[0] * s[0], a[1] * s[1]];
};

/**
 * @param {Array} a vector
 * @param {Number} s
 */
exports.divide = function(a, s) {
   if (typeof s === 'number') {
      return [a[0] / s, a[1] / s];
   }
   throw new Error('only divide by scalar supported');
};

/**
 * @param {Array} vector [v0, v1]
 * @returns {Number} length of vector
 */
var len = exports.len = function(v) {
   return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
};

/**
 *
 * normalize vector to unit vector
 * @param {Array} vector [v0, v1]
 * @returns {Array} unit vector [v0, v1]
 */
var unit = exports.unit = function(v) {
   var l = len(v);
   if(l) return [v[0] / l, v[1] / l];
   return [0, 0];
};

/**
 *
 * rotate vector
 * @param {Array} vector [v0, v1]
 * @param {Number} angle to rotate vector by, radians. can be negative
 * @returns {Array} rotated vector [v0, v1]
 */
exports.rotate=function(v, angle){
   angle=math.normaliseRadians(angle);
   return [v[0]* Math.cos(angle)-v[1]*Math.sin(angle),
           v[0]* Math.sin(angle)+v[1]*Math.cos(angle)];

};

/**
 *
 * calculate vector dot product
 * @param {Array} vector [v0, v1]
 * @param {Array} vector [v0, v1]
 * @returns {Number} dot product of v1 and v2
 */
var dot = exports.dot=function(v1, v2){
   return (v1[0] * v2[0]) + (v1[1] * v2[1]);
};

/**
 *
 * calculate angle between vectors
 * @param {Array} vector [v0, v1]
 * @param {Array} vector [v0, v1]
 * @returns {Number} angle between v1 and v2 in radians
 */
exports.angle=function(v1, v2){
   var a1 = Math.atan2(v1[0], v1[1]);
   var a2 = Math.atan2(v2[0], v2[1]);
   var rel = a1 - a2;
   return rel - Math.floor((rel + Math.PI) / (2 * Math.PI)) * (2 * Math.PI) - (2 * Math.PI);
};

/**
 * @returns {Array} vector with max length as specified.
 */
exports.truncate = function(v, maxLength) {
   if (len(v) > maxLength) {
      return multiply(unit(v), maxLength);
   };
   return v;
};

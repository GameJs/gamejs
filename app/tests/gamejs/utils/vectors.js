var assert = require('assert');

include('gamejs/utils/vectors');

var EPS = 0.000001;
exports.testDistance = function() {
   assert.isTrue(distance([0,0], [5, 5]) - 7.0710678118654755 < EPS);
   assert.isTrue(distance([0,0], [-3, -5]) - 5.830951894845301 < EPS);
   assert.isTrue(distance([-55,11], [-3, -5]) - 54.405882034941776 < EPS);
};

exports.testLen = function() {
   assert.equal(5, len([0, 5]));
   assert.isTrue(len([5, 8]) - 9.433981132056603 < EPS);
};

exports.testUnit = function() {
   var u = unit([1,1]);
   var du = unit(u);
   assert.isTrue(u[0] - du[0] < EPS);
   assert.isTrue(u[1] - du[1] < EPS);
};

var assert = require('assert');

include('../../../lib/gamejs/utils/vectors');

var EPS = 0.000001;

/*
 *tests if two vectors are equal with EPS margin for error
 */
function vectorsEqual(v1, v2){
   return (Math.abs(v1[0]-v2[0]) < EPS) && (Math.abs(v1[1]-v2[1]) < EPS);
}

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

exports.testRotate = function(){
   //rotate 90 degrees
   assert.isTrue(vectorsEqual(rotate([0, -1], Math.PI/2),
                              [1, 0]));
   //rotate 180 degrees
   assert.isTrue(vectorsEqual(rotate([0.0, -1.0], Math.PI),
                                     [0, 1]));
<<<<<<< HEAD
   
   //rotate 540 degrees
   assert.isTrue(vectorsEqual(rotate([0.0, -1.0], 3*Math.PI),
                                     [0, 1]));
   
   //rotate -90 degrees
   assert.isTrue(vectorsEqual(rotate([0, -1], -Math.PI/2),
                              [-1, 0]));
   
   //rotate zero length vector
   assert.isTrue(vectorsEqual(rotate([0, 0], 3),
                              [0, 0]));
   
   //rotate  a vector 0 radians
   assert.isTrue(vectorsEqual(rotate([0, -1], 0),
                              [0, -1])); 
=======

   //rotate 540 degrees
   assert.isTrue(vectorsEqual(rotate([0.0, -1.0], 3*Math.PI),
                                     [0, 1]));

   //rotate -90 degrees
   assert.isTrue(vectorsEqual(rotate([0, -1], -Math.PI/2),
                              [-1, 0]));

   //rotate zero length vector
   assert.isTrue(vectorsEqual(rotate([0, 0], 3),
                              [0, 0]));

   //rotate  a vector 0 radians
   assert.isTrue(vectorsEqual(rotate([0, -1], 0),
                              [0, -1]));
>>>>>>> ecb22b57273051bfa32490890ad6855e2f6f2356
};

exports.testDot = function(){
   assert.isTrue(dot([1, 4], [2, 3])==1*2+4*3);
};

exports.testAngle = function(){
   //90 degree angle
   assert.isTrue(Math.abs(angle([0, -1], [1, 0]))-Math.PI/2 < EPS);
<<<<<<< HEAD
   
   //90 degree angle, other direction
   assert.isTrue(Math.abs(angle([0, -1], [-1, 0]))-Math.PI/2 < EPS);
   
   //180 degree angle
   assert.isTrue(Math.abs(angle([1, 0], [-1, 0]))-Math.PI < EPS);
   
=======

   //90 degree angle, other direction
   assert.isTrue(Math.abs(angle([0, -1], [-1, 0]))-Math.PI/2 < EPS);

   //180 degree angle
   assert.isTrue(Math.abs(angle([1, 0], [-1, 0]))-Math.PI < EPS);

>>>>>>> ecb22b57273051bfa32490890ad6855e2f6f2356
   //0 degrees
   assert.isTrue(angle([0, -1], [0, -1]) < EPS);
};

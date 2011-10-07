var $v = require('gamejs/utils/vectors');
qModule('gamejs/utils/vectors');

var EPS = 0.000001;

/*
 *tests if two vectors are equal with EPS margin for error
 */
function vectorsEqual(v1, v2){
   return (Math.abs(v1[0]-v2[0]) < EPS) && (Math.abs(v1[1]-v2[1]) < EPS);
}

test('Distance', function() {
   ok($v.distance([0,0], [5, 5]) - 7.0710678118654755 < EPS);
   ok($v.distance([0,0], [-3, -5]) - 5.830951894845301 < EPS);
   ok($v.distance([-55,11], [-3, -5]) - 54.405882034941776 < EPS);
});

test('Len', function() {
   equal(5, $v.len([0, 5]));
   ok($v.len([5, 8]) - 9.433981132056603 < EPS);
});

test('Unit', function() {
   var u = $v.unit([1,1]);
   var du = $v.unit(u);
   ok(u[0] - du[0] < EPS);
   ok(u[1] - du[1] < EPS);
});

test('Rotate', function(){
   //rotate 90 degrees
   ok(vectorsEqual($v.rotate([0, -1], Math.PI/2),
                              [1, 0]));
   //rotate 180 degrees
   ok(vectorsEqual($v.rotate([0.0, -1.0], Math.PI),
                                     [0, 1]));

   //rotate 540 degrees
   ok(vectorsEqual($v.rotate([0.0, -1.0], 3*Math.PI),
                                     [0, 1]));

   //rotate -90 degrees
   ok(vectorsEqual($v.rotate([0, -1], -Math.PI/2),
                              [-1, 0]));

   //rotate zero length vector
   ok(vectorsEqual($v.rotate([0, 0], 3),
                              [0, 0]));

   //rotate  a vector 0 radians
   ok(vectorsEqual($v.rotate([0, -1], 0),
                              [0, -1]));
});

test('Dot', function(){
   ok($v.dot([1, 4], [2, 3])==1*2+4*3);
});

test('Angle', function(){
   //90 degree angle
   ok($v.angle([0, -1], [1, 0])+Math.PI/2 < EPS);

   //90 degree angle, other direction
   ok($v.angle([0, -1], [-1, 0])-Math.PI/2 < EPS);

   //180 degree angle
   ok($v.angle([1, 0], [-1, 0])-Math.PI < EPS);

   //0 degrees
   ok($v.angle([0, -1], [0, -1]) < EPS);
});

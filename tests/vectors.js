var $v = require('gamejs/utils/vectors');
qModule('gamejs/utils/vectors');

var EPS = 0.000001;

test('Distance', function() {
   close($v.distance([0,0], [5, 5]), 7.0710678118654755, EPS);
   close($v.distance([0,0], [-3, -5]), 5.830951894845301, EPS);
   close($v.distance([-55,11], [-3, -5]), 54.405882034941776, EPS);
});

test('Len', function() {
   equal(5, $v.len([0, 5]));
   close($v.len([5, 8]), 9.433981132056603, EPS);
});

test('Unit', function() {
   var u = $v.unit([1,1]);
   var du = $v.unit(u);
   ok(u[0] - du[0] < EPS);
   ok(u[1] - du[1] < EPS);
});

test('Rotate', function(){
   //rotate 90 degrees
   QUnit.vectorsClose($v.rotate([0, -1], Math.PI/2), [1, 0], [EPS, EPS]);
   //rotate 180 degrees
   QUnit.vectorsClose($v.rotate([0.0, -1.0], Math.PI), [0, 1], [EPS, EPS]);

   //rotate 540 degrees
   QUnit.vectorsClose($v.rotate([0.0, -1.0], 3*Math.PI), [0, 1], [EPS, EPS]);

   //rotate -90 degrees
   QUnit.vectorsClose($v.rotate([0, -1], -Math.PI/2), [-1, 0], [EPS, EPS]);

   //rotate zero length vector
   QUnit.vectorsClose($v.rotate([0, 0], 3), [0, 0], [EPS, EPS]);

   //rotate  a vector 0 radians
   QUnit.vectorsClose($v.rotate([0, -1], 0), [0, -1], [EPS, EPS]);
});

test('Dot', function(){
   ok($v.dot([1, 4], [2, 3])==1*2+4*3);
});

test('Angle', function(){
   //90 degree angle
   close($v.angle([0, -1], [1, 0]), Math.PI/2, EPS);

   //90 degree angle, other direction
   close($v.angle([0, -1], [-1, 0]), Math.PI/2, EPS);

   //180 degree angle
   close($v.angle([1, 0], [-1, 0]), Math.PI, EPS);

   //0 degrees
   close($v.angle([0, -1], [0, -1]), EPS);
});

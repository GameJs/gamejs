var $m = require('gamejs/utils/math');
qModule('gamejs/utils/math');

var degrees = $m.degrees;
var radians = $m.radians;
var normaliseDegrees = $m.normaliseDegrees;
var normaliseRadians = $m.normaliseRadians;

var EPS = 0.000001;

test('Degrees', function(){
    ok(degrees(0)==0);
    ok(degrees(Math.PI)==180);
    ok(degrees(Math.PI*3)==180*3);
});

test('Radians', function(){
    ok(radians(0)==0);
    close(radians(90), Math.PI/2, EPS);
    close(radians(180*3), Math.PI*3, EPS);
});

test('NormaliseDegrees', function(){
    ok(normaliseDegrees(0)==0);
    ok(normaliseDegrees(187)==187);
    ok(normaliseDegrees(400)==40);
    ok(normaliseDegrees(-60)==300);
    ok(normaliseDegrees(-400)==320);
});

test('NormaliseRadians', function(){
    ok(normaliseRadians(0)==0);
    ok(normaliseRadians(Math.PI)==Math.PI);
    close(normaliseRadians(Math.PI*3), Math.PI, EPS);
    close(normaliseRadians(-Math.PI*9), Math.PI, EPS);
});

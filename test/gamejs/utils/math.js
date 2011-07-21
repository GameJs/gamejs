var assert = require('assert');

include('../../../lib/gamejs/utils/math');

var EPS = 0.000001;

exports.testDegrees=function(){
    assert.isTrue(degrees(0)==0);
    assert.isTrue(degrees(Math.PI)==180);
    assert.isTrue(degrees(Math.PI*3)==180*3);
}

exports.testRadians=function(){
    assert.isTrue(radians(0)==0);
    assert.isTrue(Math.abs(radians(90)-Math.PI/2)<EPS);
    assert.isTrue(Math.abs(radians(180*3)-Math.PI*3)<EPS);
}

exports.testNormaliseDegrees=function(){
    assert.isTrue(normaliseDegrees(0)==0);
    assert.isTrue(normaliseDegrees(187)==187);
    assert.isTrue(normaliseDegrees(400)==40);
    assert.isTrue(normaliseDegrees(-60)==300);
    assert.isTrue(normaliseDegrees(-400)==320);
}

exports.testNormaliseRadians=function(){
    assert.isTrue(normaliseRadians(0)==0);
    assert.isTrue(normaliseRadians(Math.PI)==Math.PI);
    assert.isTrue(normaliseRadians(Math.PI*3)-Math.PI < EPS);
    assert.isTrue(normaliseRadians(-Math.PI*9)-Math.PI < EPS);
}
// browser env before requireing gamejs modules
global.window = {};

var gamejs  = require('../lib/gamejs');
var assert = require('assert');

exports.setUp = function() {
}

exports.testRectConstructors = function() {
   // test various constructor forms

   var [left, top, width, height] = [11, 12, 13, 14];

   var rect = new gamejs.Rect([left, top]);
   assert.isTrue(rect instanceof gamejs.Rect);
   assert.strictEqual(rect.left, left);
   assert.strictEqual(rect.top, top);
   assert.strictEqual(rect.width, 0);
   assert.strictEqual(rect.height, 0);
   assert.strictEqual(rect.bottom, top);
   assert.strictEqual(rect.right, left);
   assert.deepEqual(rect.center, [
      left,
      top
   ]);

   var rect = new gamejs.Rect([left, top], [width, height]);
   assert.isTrue(rect instanceof gamejs.Rect);
   assert.strictEqual(rect.left, left);
   assert.strictEqual(rect.top, top);
   assert.strictEqual(rect.width, width);
   assert.strictEqual(rect.height, height);
   assert.strictEqual(rect.bottom, top + height);
   assert.strictEqual(rect.right, left + width);
   assert.deepEqual(rect.center, [
      left + width / 2,
      top + height / 2
   ]);

   var rect = new gamejs.Rect([left, top, width, height]);
   assert.isTrue(rect instanceof gamejs.Rect);
   assert.strictEqual(rect.left, left);
   assert.strictEqual(rect.top, top);
   assert.strictEqual(rect.width, width);
   assert.strictEqual(rect.height, height);
   assert.strictEqual(rect.bottom, top + height);
   assert.strictEqual(rect.right, left + width);
   assert.deepEqual(rect.center, [
      left + width / 2,
      top + height / 2
   ]);

   var rect = new gamejs.Rect(left, top, width, height);
   assert.isTrue(rect instanceof gamejs.Rect);
   assert.strictEqual(rect.left, left);
   assert.strictEqual(rect.top, top);
   assert.strictEqual(rect.width, width);
   assert.strictEqual(rect.height, height);
   assert.strictEqual(rect.bottom, top + height);
   assert.strictEqual(rect.right, left + width);
   assert.deepEqual(rect.center, [
      left + width / 2,
      top + height / 2
   ]);
};

exports.testRectSetters = function() {
   var [left, top, width, height] = [10, 20, 30, 40];
   var rect = new gamejs.Rect(left, top, width, height);
   var newCenter = [50, 60];

   // new center
   rect.center = newCenter;
   assert.strictEqual(rect.left, parseInt(newCenter[0] - width / 2, 10));
   assert.strictEqual(rect.top, parseInt(newCenter[1] - height / 2, 10));
   assert.strictEqual(rect.width, width);
   assert.strictEqual(rect.height, height);
   assert.strictEqual(rect.bottom, parseInt(newCenter[1] + height / 2, 10));
   assert.strictEqual(rect.right, parseInt(newCenter[0] + width / 2, 10));
   assert.deepEqual(rect.center, newCenter);

   // move it back to old center
   rect.moveIp((left + width/2) - newCenter[0], (top + height/2) - newCenter[1]);
   assert.strictEqual(rect.left, left);
   assert.strictEqual(rect.top, top);
   assert.strictEqual(rect.width, width);
   assert.strictEqual(rect.height, height);
   assert.strictEqual(rect.bottom, top + height);
   assert.strictEqual(rect.right, left + width);
   assert.deepEqual(rect.center, [
      left + parseInt(width / 2, 10),
      top + parseInt(height / 2, 10)
   ]);
};

exports.testRectCollide = function() {
   // overlapping
   var rect = new gamejs.Rect(0, 0, 10, 10);
   var rectTwo = new gamejs.Rect(5, 5, 10, 10);
   assert.isTrue(rect.collideRect(rectTwo));
   assert.isTrue(rectTwo.collideRect(rect));

   // touching
   rectTwo = new gamejs.Rect(10, 10, 10, 10);
   assert.isTrue(rect.collideRect(rectTwo));
   assert.isTrue(rectTwo.collideRect(rect));

   // rects in different quadrants
   rectTwo = new gamejs.Rect(-20, -20, 10, 10);
   assert.isFalse(rect.collideRect(rectTwo));
   assert.isFalse(rectTwo.collideRect(rect));

   rectTwo = new gamejs.Rect(-20, 0, 10, 10);
   assert.isFalse(rect.collideRect(rectTwo));
   assert.isFalse(rectTwo.collideRect(rect));

   rectTwo = new gamejs.Rect(0, -20, 10, 10);
   assert.isFalse(rect.collideRect(rectTwo));
   assert.isFalse(rectTwo.collideRect(rect));

   // collide point
   assert.isTrue(rect.collidePoint([5, 5]));
   assert.isTrue(rect.collidePoint(5, 5));

   // touching
   assert.isTrue(rect.collidePoint(0, 0));

   // diff quadrants
   assert.isFalse(rect.collidePoint(-10, 0));
   assert.isFalse(rect.collidePoint(0, -10));
   assert.isFalse(rect.collidePoint(-10, -10));

   // collide lines
   assert.isTrue(rect.collideLine([0,0], [5,5]));
   assert.isTrue(rect.collideLine([5,5], [20,20]));

   // touching
   assert.isTrue(rect.collideLine([-10,-10], [0,0]));

   // no collide
   assert.isFalse(rect.collideLine([20, 20], [50,50]));
   assert.isFalse(rect.collideLine([-10,-10], [-20,-20]));
};

exports.testSurfaceConstructors = function() {
   // browser objects
   global.document = {
      createElement: function() {
         return {

         }
      }
   };

   var [width, height] = [30, 40];
   var surface = new gamejs.Surface(width, height);
   assert.isTrue(surface instanceof gamejs.Surface);
   assert.deepEqual(surface.getSize(), [width, height]);
   assert.isTrue(surface.rect instanceof gamejs.Rect);
   assert.deepEqual([surface.rect.left,
      surface.rect.top,
      surface.rect.width,
      surface.rect.height],
      [0,
      0,
      width,
      height]);
};

// FIXME howto test blit?

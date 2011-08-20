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

   // set bottom
   rect.bottom = 50;
   assert.strictEqual(rect.bottom, 50);
   assert.strictEqual(rect.top, 50 - height);

   // set right
   rect.right = 50;
   assert.strictEqual(rect.right, 50);
   assert.strictEqual(rect.left, 50 - width);

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

exports.testRectClip = function() {
   var rect = new gamejs.Rect(0, 0, 20, 20);
   var rectTwo = new gamejs.Rect(50, 0, 20, 20);

   // not overlaping
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(0,0,0,0));

   // A inside B
   rectTwo = new gamejs.Rect(5, 5, 5, 5);
   assert.deepEqual(rect.clip(rectTwo), rectTwo);

   // B inside A
   rectTwo = new gamejs.Rect(-1, -1, 21, 21);
   assert.deepEqual(rect.clip(rectTwo), rect);

   // A clip A
   assert.deepEqual(rect.clip(rect), rect);

   // top left
   rectTwo = new gamejs.Rect(-1, -1, 11, 11);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 0, 10, 10));

   // top left inverse
   rectTwo = new gamejs.Rect(5, 5, 30, 30);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(5, 5, 15, 15));

   // top right
   rectTwo = new gamejs.Rect(5, 5, 11, 11);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(5, 5, 11, 11));

   // top right inverse
   rectTwo = new gamejs.Rect(-5, 5, 30, 30);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 5, 20, 15));

   // bottom left
   rectTwo = new gamejs.Rect(-1, 18, 3, 3);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 18, 2, 2));

   // bottom left inverse
   rectTwo = new gamejs.Rect(18, -18, 20, 20);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(18, 0, 2, 2));

   // bottom right
   rectTwo = new gamejs.Rect(18, 18, 3, 3);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(18, 18, 2, 2));

   // bottom right inverse
   rectTwo = new gamejs.Rect(-18, -18, 20, 20);
   assert.deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 0, 2, 2));
}

exports.testRectUnion = function() {
   var rect = new gamejs.Rect(0, 0, 10, 10);
   var rectTwo = new gamejs.Rect(15, 15, 1, 1);
   // outside
   assert.deepEqual(rect.union(rectTwo), new gamejs.Rect(0, 0, 16, 16));

   // identity
   assert.deepEqual(rect.union(rect), rect);

   // inside
   rectTwo = new gamejs.Rect(3, 3, 3, 3);
   assert.deepEqual(rect.union(rectTwo), rect);

   // overlaping
   rectTwo = new gamejs.Rect(-5, 2, 16, 15);
   assert.deepEqual(rect.union(rectTwo), new gamejs.Rect(-5, 0, 16, 17));

   rectTwo = new gamejs.Rect(9, 9, 2, 2);
   assert.deepEqual(rect.union(rectTwo), new gamejs.Rect(0, 0, 11, 11));
}

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

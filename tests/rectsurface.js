var gamejs  = require('gamejs');
qModule('gamejs');

test('RectConstructors', function() {
   // test various constructor forms

   var left = 11;
   var top = 12;
   var width = 13;
   var height = 14;

   var rect = new gamejs.Rect([left, top]);
   ok(rect instanceof gamejs.Rect);
   strictEqual(rect.left, left);
   strictEqual(rect.top, top);
   strictEqual(rect.width, 0);
   strictEqual(rect.height, 0);
   strictEqual(rect.bottom, top);
   strictEqual(rect.right, left);
   deepEqual(rect.center, [
      left,
      top
   ]);

   var rect = new gamejs.Rect([left, top], [width, height]);
   ok(rect instanceof gamejs.Rect);
   strictEqual(rect.left, left);
   strictEqual(rect.top, top);
   strictEqual(rect.width, width);
   strictEqual(rect.height, height);
   strictEqual(rect.bottom, top + height);
   strictEqual(rect.right, left + width);
   deepEqual(rect.center, [
      left + Math.floor(width / 2),
      top + Math.floor(height / 2)
   ]);

   var rect = new gamejs.Rect([left, top, width, height]);
   ok(rect instanceof gamejs.Rect);
   strictEqual(rect.left, left);
   strictEqual(rect.top, top);
   strictEqual(rect.width, width);
   strictEqual(rect.height, height);
   strictEqual(rect.bottom, top + height);
   strictEqual(rect.right, left + width);
   deepEqual(rect.center, [
      left + Math.floor(width / 2),
      top + Math.floor(height / 2)
   ]);

   var rect = new gamejs.Rect(left, top, width, height);
   ok(rect instanceof gamejs.Rect);
   strictEqual(rect.left, left);
   strictEqual(rect.top, top);
   strictEqual(rect.width, width);
   strictEqual(rect.height, height);
   strictEqual(rect.bottom, top + height);
   strictEqual(rect.right, left + width);
   deepEqual(rect.center, [
      left + Math.floor(width / 2),
      top + Math.floor(height / 2)
   ]);
});

test('RectSetters', function() {
   var left = 10;
   var top = 20;
   var width = 30;
   var height = 40;
   var rect = new gamejs.Rect(left, top, width, height);
   var newCenter = [50, 60];

   // new center
   rect.center = newCenter;
   strictEqual(rect.left, parseInt(newCenter[0] - width / 2, 10));
   strictEqual(rect.top, parseInt(newCenter[1] - height / 2, 10));
   strictEqual(rect.width, width);
   strictEqual(rect.height, height);
   strictEqual(rect.bottom, parseInt(newCenter[1] + height / 2, 10));
   strictEqual(rect.right, parseInt(newCenter[0] + width / 2, 10));
   deepEqual(rect.center, newCenter);

   // move it back to old center
   rect.moveIp((left + width/2) - newCenter[0], (top + height/2) - newCenter[1]);
   strictEqual(rect.left, left);
   strictEqual(rect.top, top);
   strictEqual(rect.width, width);
   strictEqual(rect.height, height);
   strictEqual(rect.bottom, top + height);
   strictEqual(rect.right, left + width);
   deepEqual(rect.center, [
      left + parseInt(width / 2, 10),
      top + parseInt(height / 2, 10)
   ]);

   // set bottom
   rect.bottom = 50;
   strictEqual(rect.bottom, 50);
   strictEqual(rect.top, 50 - height);

   // set right
   rect.right = 50;
   strictEqual(rect.right, 50);
   strictEqual(rect.left, 50 - width);

   // set x
   rect.x = 88;
   strictEqual(rect.left, 88);
   strictEqual(rect.left, rect.x);

   // set y
   rect.y = 88;
   strictEqual(rect.top, 88);
   strictEqual(rect.top, rect.y);

});

test('RectInflate', function() {
   var rect = new gamejs.Rect(0, 0, 10, 10);
   var newRect = rect.inflate(1, 0);
   strictEqual(newRect.left, 0);
   strictEqual(newRect.top, 0);
   strictEqual(newRect.width, 11);
   strictEqual(newRect.height, 10);
   
   rect = new gamejs.Rect(5, 5, 12, 14);
   newRect = rect.inflate(12, 3);
   deepEqual(newRect.center, rect.center);
   newRect = rect.inflate(-3, 3);
   deepEqual(newRect.center, rect.center);
   strictEqual(newRect.left, 7);
   strictEqual(newRect.top, 4);
   strictEqual(newRect.width, 9);
   strictEqual(newRect.height, 17);

   rect.inflateIp(-2, -2);
   strictEqual(rect.left, 6);
   strictEqual(rect.top, 6);
   strictEqual(rect.width, 10);
   strictEqual(rect.height, 12);
});

test('RectCollide', function() {
   // overlapping
   var rect = new gamejs.Rect(0, 0, 10, 10);
   var rectTwo = new gamejs.Rect(5, 5, 10, 10);
   ok(rect.collideRect(rectTwo));
   ok(rectTwo.collideRect(rect));

   // touching
   rectTwo = new gamejs.Rect(10, 10, 10, 10);
   ok(rect.collideRect(rectTwo));
   ok(rectTwo.collideRect(rect));

   // rects in different quadrants
   rectTwo = new gamejs.Rect(-20, -20, 10, 10);
   ok(!rect.collideRect(rectTwo));
   ok(!rectTwo.collideRect(rect));

   rectTwo = new gamejs.Rect(-20, 0, 10, 10);
   ok(!rect.collideRect(rectTwo));
   ok(!rectTwo.collideRect(rect));

   rectTwo = new gamejs.Rect(0, -20, 10, 10);
   ok(!rect.collideRect(rectTwo));
   ok(!rectTwo.collideRect(rect));

   // collide point
   ok(rect.collidePoint([5, 5]));
   ok(rect.collidePoint(5, 5));

   // touching
   ok(rect.collidePoint(0, 0));

   // diff quadrants
   ok(!rect.collidePoint(-10, 0));
   ok(!rect.collidePoint(0, -10));
   ok(!rect.collidePoint(-10, -10));

   // collide lines
   ok(rect.collideLine([0,0], [5,5]));
   ok(rect.collideLine([5,5], [20,20]));

   // touching
   ok(rect.collideLine([-10,-10], [0,0]));

   // no collide
   ok(!rect.collideLine([20, 20], [50,50]));
   ok(!rect.collideLine([-10,-10], [-20,-20]));
});

test('RectClip', function() {
   var rect = new gamejs.Rect(0, 0, 20, 20);
   var rectTwo = new gamejs.Rect(50, 0, 20, 20);

   // not overlaping
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(0,0,0,0));

   // A inside B
   rectTwo = new gamejs.Rect(5, 5, 5, 5);
   deepEqual(rect.clip(rectTwo), rectTwo);

   // B inside A
   rectTwo = new gamejs.Rect(-1, -1, 21, 21);
   deepEqual(rect.clip(rectTwo), rect);

   // A clip A
   deepEqual(rect.clip(rect), rect);

   // top left
   rectTwo = new gamejs.Rect(-1, -1, 11, 11);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 0, 10, 10));

   // top left inverse
   rectTwo = new gamejs.Rect(5, 5, 30, 30);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(5, 5, 15, 15));

   // top right
   rectTwo = new gamejs.Rect(5, 5, 11, 11);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(5, 5, 11, 11));

   // top right inverse
   rectTwo = new gamejs.Rect(-5, 5, 30, 30);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 5, 20, 15));

   // bottom left
   rectTwo = new gamejs.Rect(-1, 18, 3, 3);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 18, 2, 2));

   // bottom left inverse
   rectTwo = new gamejs.Rect(18, -18, 20, 20);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(18, 0, 2, 2));

   // bottom right
   rectTwo = new gamejs.Rect(18, 18, 3, 3);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(18, 18, 2, 2));

   // bottom right inverse
   rectTwo = new gamejs.Rect(-18, -18, 20, 20);
   deepEqual(rect.clip(rectTwo), new gamejs.Rect(0, 0, 2, 2));
});

test('RectUnion', function() {
   var rect = new gamejs.Rect(0, 0, 10, 10);
   var rectTwo = new gamejs.Rect(15, 15, 1, 1);
   // outside
   deepEqual(rect.union(rectTwo), new gamejs.Rect(0, 0, 16, 16));

   // identity
   deepEqual(rect.union(rect), rect);

   // inside
   rectTwo = new gamejs.Rect(3, 3, 3, 3);
   deepEqual(rect.union(rectTwo), rect);

   // overlaping
   rectTwo = new gamejs.Rect(-5, 2, 16, 15);
   deepEqual(rect.union(rectTwo), new gamejs.Rect(-5, 0, 16, 17));

   rectTwo = new gamejs.Rect(9, 9, 2, 2);
   deepEqual(rect.union(rectTwo), new gamejs.Rect(0, 0, 11, 11));
});

test('SurfaceConstructors', function() {

   var width = 30;
   var height = 40;
   var surface = new gamejs.Surface(width, height);
   ok(surface instanceof gamejs.Surface);
   deepEqual(surface.getSize(), [width, height]);
   ok(surface.rect instanceof gamejs.Rect);
   deepEqual([surface.rect.left,
      surface.rect.top,
      surface.rect.width,
      surface.rect.height],
      [0,
      0,
      width,
      height]);
});

test('SurfaceFillClear', function() {
   var pixelEqual = QUnit.pixelEqual;

   var surface = new gamejs.Surface([10,10]);

   surface.fill('rgb(55, 66, 77)');
   pixelEqual(surface, [1, 1], [55, 66, 77, 255]);

   surface.fill('#ff0000');
   pixelEqual(surface, [1, 1], [255, 0, 0, 255]);

   surface.fill('rgb(12, 13, 14)');
   pixelEqual(surface, [1, 1], [12, 13, 14, 255]);

   surface.fill('rgb(13, 14, 15)', new gamejs.Rect(0, 0, 2, 2));
   pixelEqual(surface, [1, 1], [13, 14, 15, 255]);
   pixelEqual(surface, [3, 3], [12, 13, 14, 255]);

   surface.clear();
   pixelEqual(surface, [1, 1], [0, 0, 0, 0]);
});

test('SurfaceClone', function() {
   var surfaceEqual = QUnit.surfaceEqual;

   var surface = new gamejs.Surface([20,20]);

   surface.fill('#20394');

   var clone = surface.clone();
   equal(surface.width, clone.width);
   equal(surface.height, clone.height);
   equal(surface.getAlpha(), clone.getAlpha());
   surfaceEqual(surface, clone);
});

test('SurfaceBlit', function() {
   var surfaceEqual = QUnit.surfaceEqual;
   var pixelEqual = QUnit.pixelEqual;

   var big = new gamejs.Surface([100, 100]);
   big.fill('rgb(255,0,0)');

   var second = new gamejs.Surface([10,10]);
   second.fill('rgb(0,255,0)');

   // blitting without target puts it into top left corner
   big.blit(second);
   pixelEqual(big, [0,0], [0,255,0]);
   pixelEqual(big, [9,9], [0,255,0]);
   pixelEqual(big, [10,10], [255,0,0]);
   pixelEqual(big, [99,99], [255,0,0]);

   // blitting with whole big rect effectively fills
   big.fill('rgb(255,0,0)');
   big.blit(second, big.getRect());
   pixelEqual(big, [0,0], [0,255,0]);
   pixelEqual(big, [9,9], [0,255,0]);
   pixelEqual(big, [10,10], [0,255,0]);
   pixelEqual(big, [99,99], [0,255,0]);

   // blitting at position
   big.fill('rgb(255,0,0)');
   big.blit(second, [20,20]);
   pixelEqual(big, [0,0], [255,0,0]);
   pixelEqual(big, [19,19], [255,0,0]);
   pixelEqual(big, [20,20], [0,255,0]);
   pixelEqual(big, [29,29], [0,255,0]);
   pixelEqual(big, [30,30], [255,0,0]);

   // blitting at position with smaller source area
   big.fill('rgb(255,0,0)');
   big.blit(second, [20,20], new gamejs.Rect([0,0],[5,5]));
   pixelEqual(big, [0,0], [255,0,0]);
   pixelEqual(big, [19,19], [255,0,0]);
   pixelEqual(big, [20,20], [0,255,0]);
   pixelEqual(big, [24,24], [0,255,0]);
   pixelEqual(big, [25,25], [0,255,0]);
   pixelEqual(big, [26,26], [0,255,0]);
   pixelEqual(big, [30,30], [255,0,0]);
});

test('SurfaceAlpha', function() {
   var pixelEqual = QUnit.pixelEqual;

   var first = new gamejs.Surface([20,20]);
   var second = new gamejs.Surface([20,20]);
   second.fill('rgb(255,0,0)');
   second.setAlpha(0.5);

   first.blit(second);
   pixelEqual(first, [5,5], [255,0,0,128]);
});

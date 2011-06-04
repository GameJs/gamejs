var sprite = require('../../lib/gamejs/sprite');
var assert = require('assert');

exports.testSpriteConstructor = function() {
   var sp = new sprite.Sprite();
   assert.isTrue(sp instanceof sprite.Sprite);
   assert.strictEqual(sp.image, null);
   assert.strictEqual(sp.rect, null);
};

exports.testSpriteMethods = function() {
   var sp = new sprite.Sprite();
   sp.kill();
   assert.isTrue(sp.isDead());
};

exports.testSpriteGroup = function() {
   var sprites = [new sprite.Sprite() for (i in [1,2,3,4,5])];
   var group = new sprite.Group(sprites);
   assert.isTrue(group instanceof sprite.Group);
   // group has sprites?
   assert.isTrue(group.has(sprites));
   for each (var sp in sprites) {
      assert.isTrue(group.has(sp));
   }
   // group cascades update & draw?
   sprites = sprites.map(function(sp) {
      sp._testUpdateCalled = false;
      sp._testDurationPassed = null;

      sp._testDrawCalled = false;
      sp._testSurfacePassed = null;
      sp.draw = function(surface) {
         sp._testDrawCalled = true;
         sp._testSurfacePassed = surface;
      }
      sp.update = function(msDuration) {
         sp._testUpdateCalled = true;
         sp._testDurationPassed = msDuration;

      };
      return sp;
   }, this);
   var msDuration = 12345;
   group.update(msDuration);
   for each (var sp in sprites) {
      assert.isTrue(sp._testUpdateCalled);
      assert.equal(sp._testDurationPassed, msDuration);
   };
   var surface = '{{A Surface Object}}';
   group.draw(surface);
   for each (var sp in sprites) {
      assert.isTrue(sp._testDrawCalled);
      assert.equal(sp._testSurfacePassed, surface);
   };

   // remove one by one
   for each (var sp in sprites) {
      group.remove(sp);
      assert.isFalse(group.has(sp));
   }
};

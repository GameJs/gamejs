var gamejs = require('gamejs');
var sprite = require('gamejs/sprite');
qModule('gamejs/sprite');

test('SpriteConstructor', function() {
   var sp = new sprite.Sprite();
   ok(sp instanceof sprite.Sprite);
   strictEqual(sp.image, null);
   strictEqual(sp.rect, null);
});

test('SpriteMethods', function() {
   var sp = new sprite.Sprite();
   sp.kill();
   ok(sp.isDead());
});

test('SpriteGroup', function() {
   var sprites = [];
   var i = 5;
   while (i-->0) {
      sprites.push(new sprite.Sprite());
   }
   var group = new sprite.Group(sprites);
   ok(group instanceof sprite.Group);
   // group has sprites?
   ok(group.has(sprites));
   sprites.forEach(function(sp) {
      ok(group.has(sp));
   });
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
   sprites.forEach(function(sp) {
      ok(sp._testUpdateCalled);
      equal(sp._testDurationPassed, msDuration);
   });
   var surface = '{{A Surface Object}}';
   group.draw(surface);
   sprites.forEach(function(sp) {
      ok(sp._testDrawCalled);
      equal(sp._testSurfacePassed, surface);
   });

   // remove one by one
   sprites.forEach(function(sp) {
      group.remove(sp);
      ok(!group.has(sp));
   });
   
   // is other sprite removed if group.remove is called with invalid arg?
   group.add(sprites[0]);
   group.remove(sprites[1]);
   ok(group.has(sprites[0]));
});

test('SpriteCollisions', function() {
   var a = new sprite.Sprite();
   a.rect = new gamejs.Rect([0, 0], [10, 10]);
   var b = new sprite.Sprite();
   b.rect = new gamejs.Rect([10, 10], [10, 10]);

   ok(gamejs.sprite.collideCircle(a, b));

   a.radius = 1;
   b.radius = 1;
   ok(!gamejs.sprite.collideCircle(a, b));

   a.radius = 7;
   b.radius = 8;
   ok(gamejs.sprite.collideCircle(a, b));

   a.rect = new gamejs.Rect([0,0], [5,5]);
   b.rect = new gamejs.Rect([-1,-1], [5,5]);
   ok(gamejs.sprite.collideCircle(a,b));

   a.radius = 6;
   b.radius = 6;
   ok(gamejs.sprite.collideCircle(a,b));

   a.radius = 0.3;
   b.radius = 0.3;
   ok(!gamejs.sprite.collideCircle(a,b));
});

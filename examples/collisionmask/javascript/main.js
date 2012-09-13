/**
 * @fileoverview
 * Demonstrates pixel perfect collision detection utilizing image masks.
 *
 * A 'spear' is moved around with mouse or cursors keys - the text 'COLLISION'
 * appears if the spear pixel collides with the unit.
 *
 * gamejs.mask.fromSurface is used to create two pixel masks
 * that do the actual collision detection.
 *
 */
var gamejs = require('gamejs');
var mask = require('gamejs/mask');
var $v = require('gamejs/utils/vectors');

function main() {

   var display = gamejs.display.setMode([500, 350]);

   var spear = gamejs.image.load('images/spear.png');
   var unit = gamejs.image.load('images/unit.png');

   // create image masks from surface
   var mUnit = mask.fromSurface(unit);
   var mSpear = mask.fromSurface(spear);

   var unitPosition = [20, 20];
   var spearPosition = [6, 0];

   var font = new gamejs.font.Font('20px monospace');

   /**
    * tick
    */
   function tick () {
      // event handling
      gamejs.event.get().forEach(function(event) {
         var direction = {};
         direction[gamejs.event.K_UP] = [0, -1];
         direction[gamejs.event.K_DOWN] = [0, 1];
         direction[gamejs.event.K_LEFT] = [-1, 0];
         direction[gamejs.event.K_RIGHT] = [1, 0];
         if (event.type === gamejs.event.KEY_DOWN) {
            var delta = direction[event.key];
            if (delta) {
               spearPosition = $v.add(spearPosition, delta);
            }
         } else if (event.type === gamejs.event.MOUSE_MOTION) {
            if (display.rect.collidePoint(event.pos)) {
               spearPosition = $v.subtract(event.pos, spear.getSize());
            }
         }
      });

      // draw
      display.clear();
      display.blit(unit, unitPosition);
      display.blit(spear, spearPosition);
      // collision
      // the relative offset is automatically calculated by
      // the higher-level gamejs.sprite.collideMask(spriteA, spriteB)
      var relativeOffset = $v.subtract(spearPosition, unitPosition);
      var hasMaskOverlap = mUnit.overlap(mSpear, relativeOffset);
      if (hasMaskOverlap) {
         display.blit(font.render('COLLISION', '#ff0000'), [250, 50]);
      }
      display.blit(font.render('Move with mouse or cursor keys.'), [10, 250])

   };
   gamejs.time.fpsCallback(tick, this, 60);
};

gamejs.preload([
   'images/spear.png',
   'images/unit.png',
]);
gamejs.ready(main);

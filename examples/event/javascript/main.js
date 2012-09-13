/**
 * @fileoverview
 * Sparkles with position and alpha are created by mouse movement.
 * The sparkles position is updated in a time-dependant way. A sparkle
 * is removed from the simulation once it leaves the screen.
 *
 * Additionally, by pressing the cursor UP key the existing sparkles will
 * move upwards (movement vecor inverted).
 *
 */
var gamejs = require('gamejs');

function main() {

   var display = gamejs.display.setMode([850, 600]);
   gamejs.display.setCaption('example event');
   var starImage = gamejs.image.load('images/sparkle.png');

   var instructionFont = new gamejs.font.Font('30px monospace');
   var displayRect = display.rect;
   var sparkles = [];

   function tick(msDuration) {

      // handle key / mouse events
      gamejs.event.get().forEach(function(event) {
         if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_UP) {
               // reverse Y direction of sparkles
               sparkles.forEach(function(sparkle) {
                  sparkle.deltaY *= -1;
               });
            };
         } else if (event.type === gamejs.event.MOUSE_MOTION) {
            // if mouse is over display surface
            if (displayRect.collidePoint(event.pos)) {
               // add sparkle at mouse position
               sparkles.push({
                  left: event.pos[0],
                  top: event.pos[1],
                  alpha: Math.random(),
                  deltaX: 30 - Math.random() * 60,
                  deltaY: 80 + Math.random() * 40,
               });
            }
         }
      });

      // update sparkle position & alpha
      sparkles.forEach(function(sparkle) {
         // msDuration makes is frame rate independant: we don't want
         // the sparkles to move faster on a superfast computer.
         var r = (msDuration/1000);
         sparkle.left += sparkle.deltaX * r;
         sparkle.top += sparkle.deltaY * r;

      });

      // remove sparkles that are offscreen or invisible
      sparkles = sparkles.filter(function(sparkle) {
         return sparkle.top < displayRect.height && sparkle.top > 0;
      })

      // draw sparkles
      display.fill('#000000');
      display.blit(instructionFont.render('Move mouse. Press Cursor up.', '#ffffff'), [20, 20]);
      sparkles.forEach(function(sparkle) {
         starImage.setAlpha(sparkle.alpha);
         display.blit(starImage, [sparkle.left, sparkle.top]);
      });
   };

   gamejs.time.fpsCallback(tick, this, 60);
};

gamejs.preload(['images/sparkle.png']);
gamejs.ready(main);

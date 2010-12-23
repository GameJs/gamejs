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
         sparkle.left += sparkle.deltaX * (msDuration/1000);
         sparkle.top += sparkle.deltaY * (msDuration/1000);

      });

      // remove sparkles that are offscreen or invisible
      sparkles = sparkles.filter(function(sparkle) {
         return sparkle.top < displayRect.height && sparkle.left > 0;
      })

      // draw sparkles
      display.fill('#000000');
      display.blit(instructionFont.render('Move mouse. Press Cursor up.', '#ffffff'));
      sparkles.forEach(function(sparkle) {
         display.blit(starImage, [sparkle.left, sparkle.top]);
      });
   };

   gamejs.time.fpsCallback(tick, this, 30);
};

gamejs.preload(['images/sparkle.png']);
gamejs.ready(main);

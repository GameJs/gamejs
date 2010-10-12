/** 
 * Heavy work in progress, see http://gamejs.org/api/gamejs/iso/ for more info.
 */
var gamejs = require('gamejs');

var vladAnimationsMeta = {
   fps: 15,
   rootPath: 'images/vlad/',
   movementSpeed: 2,
   dying: 'tipping over',
   noLoop: ['tipping over', 'attack'],
   idle: 'stopped',
};

var vladAnimations = {
   attack: {
      name: "attack", 
      count: 11, 
      directions: ["e", "n", "ne", "nw", "s", "se", "sw", "w"],
      size: 128,
   },
   stopped:{
      name: "stopped",
      count: 0,
      directions: ["e", "n", "ne", "nw", "s", "se", "sw", "w"],
      size: 96,
   },
   'tipping over': {
      name: "tipping over",
      count: 11,
      directions: ["e", "n", "ne", "nw", "s", "se", "sw", "w"],
      size: 128,
   },
   walking: {
      name: "walking",
      count: 7,
      directions: ["e", "n", "ne", "nw", "s", "se", "sw", "w"],
      size: 96
   }
};

// create an animation with name 'vlad' - later instantiated as AnimatedSprite
gamejs.preloadAnimation('vlad', vladAnimations, vladAnimationsMeta);

function main() {
   gamejs.display.setMode([800, 600]);
   gamejs.display.setCaption("Example Iso");

   // create an animatedsprite with the properties defined for 'vlad'
   var vlad = new gamejs.iso.AnimatedSprite([100, 100], 'vlad');

   /**
    * M A I N
    */
   
   function handleUserInput() {
      gamejs.event.get().forEach(function(event) {
         if (event.type === gamejs.event.QUIT) {
            // do quit.
         }
         if (event.type === gamejs.event.KEY_DOWN) {
            if (event.key == gamejs.event.K_KP4) {
               vlad.setDirection('w');
            } else if (event.key === gamejs.event.K_KP6) {
               vlad.setDirection('e');
            } else if (event.key === gamejs.event.K_KP8) {
               vlad.setDirection('n');
            } else if (event.key === gamejs.event.K_KP2) {
               vlad.setDirection('s');
            } else if (event.key === gamejs.event.K_KP7) {
               vlad.setDirection('nw');
            } else if (event.key === gamejs.event.K_KP9) {
               vlad.setDirection('ne');
            } else if (event.key === gamejs.event.K_KP1) {
               vlad.setDirection('sw');
            } else if (event.key === gamejs.event.K_KP3) {
               vlad.setDirection('se');
            } else if (event.key === gamejs.event.K_KP5) {
               vlad.setAnimation('attack');            
            } else if (event.key === gamejs.event.K_ENTER) {
               vlad.setAnimation('walking');
            } else if (event.key === gamejs.event.K_SPACE) {
               vlad.setAnimation('tipping over');
            }
         }
         return;
      }); // end while
      return;
   }
   
   // game loop
   var mainSurface = gamejs.display.getSurface();
   var font = new gamejs.font.Font("20px Verdana"); // css font definition
   var tick = function(msDuration) {
         mainSurface.fill("#FFFFFF");
         vlad.draw(mainSurface);
         handleUserInput();
         mainSurface.blit(font.render('ENTER to move. Keypad numbers to change direction. SPACE to kill vlad'));
         vlad.update(msDuration);
   };
   gamejs.time.fpsCallback(tick, this, 30);

};

gamejs.ready(main);

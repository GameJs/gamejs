var gamejs = require('gamejs');

/**
 * a basic ship
 */
var Ship = function(rect) {
   Ship.superConstructor.apply(this, arguments);

   this.speed = 5 * Math.random();
   this.image = gamejs.transform.rotate(gamejs.image.load("images/ship.png"), parseInt(90*Math.random()));
   this.rect = new gamejs.Rect(rect);
   return this;
};
gamejs.utils.objects.extend(Ship, gamejs.sprite.Sprite);
Ship.prototype.update = function(tick) {
   this.rect.moveIp(0, -1 * this.speed);
};


function main() {
   // screen setup
   gamejs.display.setMode([800, 600]);
   gamejs.display.setCaption("Example Sprites");
   // create some ships
   var ship = new Ship([100, 100]);
   var gShips = new gamejs.sprite.Group();
   for (var i=0; i<25; i++) {
      gShips.add(new Ship([10 + i*20, 500 + i*6]));
   }

   // game loop
   var mainSurface = gamejs.display.getSurface();
   var tick = function() {
         // needs double buffering :*(
         mainSurface.fill("#FFFFFF");
         gShips.update();
         gShips.draw(mainSurface);
   };
   gamejs.time.fpsCallback(tick, this, 30);
}

/**
 * M A I N
 */
gamejs.preload(['images/ship.png']);
gamejs.ready(main);

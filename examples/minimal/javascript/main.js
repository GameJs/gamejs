/**
 * @fileoverview Minimal is the smalles GameJs app I could think of, which still shows off
 * most of the concepts GameJs introduces.
 *
 * It's a pulsating, colored circle. You can make the circle change color
 * by clicking.
 *
 */

var gamejs = require('gamejs');

var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 400;

// ball is a colored circle.
// ball can circle through color list.
// ball constantly pulsates in size.
function Ball(center) {
   this.center = center;
   this.growPerSec = Ball.GROW_PER_SEC;
   this.radius = this.growPerSec * 2;
   this.color = 0;
   return this;
};
Ball.MAX_SIZE = 200;
Ball.GROW_PER_SEC = 50;
Ball.COLORS = ['#ff0000', '#00ff00', '#0000cc'];
Ball.prototype.nextColor = function() {
   this.color += 1;
   if (this.color >= Ball.COLORS.length) {
      this.color = 0;
   }
};
Ball.prototype.draw = function(display) {
   var rgbColor = Ball.COLORS[this.color];
   var lineWidth = 0; // lineWidth zero fills the circle
   gamejs.draw.circle(display, rgbColor, this.center, this.radius, lineWidth);
};
Ball.prototype.update = function(msDuration) {
   this.radius += this.growPerSec * (msDuration / 1000);
   if (this.radius > Ball.MAX_SIZE || this.radius < Math.abs(this.growPerSec)) {
      this.radius = this.radius > Ball.MAX_SIZE ? Ball.MAX_SIZE : Math.abs(this.growPerSec);
      this.growPerSec = -this.growPerSec;
   }
};

function main() {

   // ball changes color on mouse up
   function handleEvent(event) {
      switch(event.type) {
         case gamejs.event.MOUSE_UP:
            ball.nextColor();
            break;
      };
   };

   // handle events.
   // update models.
   // clear screen.
   // draw screen.
   // called ~ 30 times per second by fps.callback
   // msDuration = actual time in milliseconds since last call
   function gameTick(msDuration) {
      gamejs.event.get().forEach(function(event) {
         handleEvent(event);
      });
      ball.update(msDuration);
      display.clear();
      ball.draw(display);
   };

   // setup screen and ball.
   // ball in screen center.
   // start game loop.
   var display = gamejs.display.setMode([SCREEN_WIDTH, SCREEN_HEIGHT]);
   var ballCenter = [SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2];
   var ball = new Ball(ballCenter);
   gamejs.time.fpsCallback(gameTick, this, 60);
};

// call main after all resources have finished loading
gamejs.ready(main);

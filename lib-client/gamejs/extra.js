var Surface = require('gamejs').Surface;
var event = require('gamejs/event');

var gamejs = require('gamejs');
var objects = require('gamejs/utils/objects');
var display = require('gamejs/display');
var sprite = require('gamejs/sprite');
var time = require('gamejs/time');
var image = require('gamejs/image');
var transform = require('gamejs/transform');

/**
 * @fileoverview Provides higher level classes for creating simple prototype games.
 *
 */

/**
 * A simple game loop with a background and layered SpriteGroups. Set its background,
 * add a SpriteGroup and call start(30) to have a running game. Usefull for prototyping.
 * @constructor
 */
var Scene = exports.Scene  = function(dims) {
   var width = dims[0];
   var height = dims[1];
   this.doEvents = function() {};
   this.update = function(){};

   // constructor
   this.screen = display.setMode([width, height]);
   this.background = new Surface(this.screen.getSize());
   this.background.fill("#cccccc");
   this.sprites = [];
   this.groups = [];

   this.fps = 30;
   return this;
};

Scene.prototype.addGroup = function(group) {
   this.groups.push(group);
   return;
};

Scene.prototype.start = function(fps) {
   this.fps = fps || 30;
   this.mainSprites = new sprite.Group(this.sprites);
   this.groups.push(this.mainSprites);
   
   this.keepGoing = true;
   
   time.fpsCallback(this._mainLoop, this, this.fps)
   return;
}

Scene.prototype.stop = function() {
   time.deleteCallback(this._mainLoop, this.fps);
   this.sprites = [];
   this.groups = [];
   this.keepGoing = false;
   return;
}

/**
 * @ignore
 */
Scene.prototype._mainLoop = function(msDuration) {
   try {
      event.get().forEach(function(event) {
         if (event.type === event.QUIT) {
            this.keepGoing = false;
         }
         this.doEvents(event);
      }, this);
      this.update(msDuration);
      this.screen.blit(this.background);
      this.groups.forEach(function(group) {
         group.update(msDuration);
         group.draw(this.screen);
      }, this);
      // TBD gamejs.display.flip()
   } catch (e) {
      throw new Error(e);
   }
   return;
};

/**
 * MovingSprite provides a default implementation for Sprite.update() which moves the
 * Sprite on a linear path according to the set angle and speed. Mostly usefull for prototype. 
 * Overwrite doUpdate(event) to react to events.
 */
var MovingSprite = exports.MovingSprite =  function() {
   MovingSprite.superConstructor.apply(this, arguments);
      
   // constructor
   
   this.imageMaster = new Surface([20, 20]);
   this.imageMaster.fill("#ff0000");
   this.image = this.imageMaster;
   this.rect = this.image.getRect();
   
   this.x = 100;
   this.y = 100;
   this.dx = 0;
   this.dy = 0;
   this.dir = 0;
   this.lastRotation = -1;
   this.rotation = 0;
   this.speed = 0;
   this.maxSpeed = 10;
   this.minSpeed = -3;
   
   return this;

};
objects.extend(MovingSprite, sprite.Sprite);

// overwrite
MovingSprite.prototype.customUpdate = function() {};

/**
 * Do not overwrite this function. It is used by MovingSprite
 * to update itself.
 */
MovingSprite.prototype.update = function(msDuration) {
   this.customUpdate(msDuration);
   if (this.lastRotation != this.rotation) this._rotate();
   this.lastRotation = this.rotation;
   this._calcVector();
   this._calcPosition();
   this.rect.center = [this.x, this.y];
   return;
};

/**
 * @ignore
 */
MovingSprite.prototype._rotate = function() {
   this.image = transform.rotate(this.imageMaster, this.rotation);
   this.rect = this.image.getRect();
   return;
}

/**
 * @ignore
 */
MovingSprite.prototype._calcVector = function() {
   var theta = this.dir / 180 * Math.PI;
   this.dx = Math.cos(theta) * this.speed;
   this.dy = Math.sin(theta) * this.speed;
   return;
};

/**
 * @ignore
 */
MovingSprite.prototype._calcPosition = function() {
   this.x += this.dx;
   this.y += this.dy;
   return;
};

MovingSprite.prototype.speedUp = function(amount) {
   this.speed += amount;
   this.speed = Math.max(this.speedMin, this.speed);
   this.speed = Math.min(this.speedMax, this.speed);
   return;
};

MovingSprite.prototype.setAngle = function(dir) {
   /// degrees
   this.dir = dir;
   this.rotation = dir;
   return;
};

MovingSprite.prototype.getAngle = function() {
   return this.dir
};

MovingSprite.prototype.setSpeed = function(speed) {
   this.speed = speed;
   return;
};

MovingSprite.prototype.setImage = function(image) {
   this.imageMaster = gamejs.image.load(image);
   return;
}

MovingSprite.prototype.setPosition = function(position) {
   this.x = position[0];
   this.y = position[1];
   return;
}

MovingSprite.prototype.addForce = function(amount, angle) {
   var radians = angle & Math.PI / 180;
   var dx = amount * Math.cos(radians);
   var dy = amount * Math.sin(radians);
   
   this.dx += dx;
   this.dy += dy;
   this.updateVector();
   return;
};

/**
 * @ignore
 */
MovingSprite.prototype.updateVector = function() {
   self.speed = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy));
   var dy = this.dy;
   var dx = this.dx;
   var radians = math.atan2(dy, dx);
   this.dir = radians / Math.PI * 180;
   return;
};

MovingSprite.prototype.dirTo = function(point) {
   var pointx = point[0];
   var pointy = point[1];
   var dx = this.x - pointx;
   var dy = this.y - pointy;
   
   var radians = Math.atan2(dy, dx);
   var dir = radians * 180 / Math.PI;
   dir += 180;
   return dir;
};


/**
 * change rotation, not move direction
 */
MovingSprite.prototype.rotateBy = function(amount) {
   this.rotation += amount;
   return;
}

/**
 * changing rotation and direction with one call
 */
MovingSprite.prototype.turnBy = function(amount) {
   // degrees
     this.dir += amount
     if (this.dir > 360) this.dir = amount
     if (this.dir < 0) this.dir = 360 - amount
     
     this.rotation = this.dir;
     return;
};

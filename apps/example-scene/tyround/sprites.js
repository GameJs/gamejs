var gamejs = require('gamejs');
/**
 * Ship
 * controlled by player
 */
var Ship = exports.Ship = function(explosionGroup, scene) {
   Ship.superConstructor.apply(this, arguments);

   this.explosionGroup = explosionGroup;
   this.scene = scene;
   this.image = gamejs.image.load("images/ship_wings.png");
   this.imageMaster = this.image;
   this.rect = this.image.getRect();
   this.x = 20;
   this.y = 20;
   this.speed = 60;
   this.heading = 0;
   this.rotateDir = 0;
   return this;
}

gamejs.utils.objects.extend(Ship, gamejs.sprite.Sprite);

Ship.prototype.update = function(msDuration) {
   if (this.rotateDir < 0) {
      this.turnBy(-5);
   } else if (this.rotateDir > 0) {
      this.turnBy(5);
   }

   // move
   var theta = this.heading / 180 * Math.PI;
   this.x += Math.cos(theta) * this.speed * (msDuration/1000);
   this.y += Math.sin(theta) * this.speed * (msDuration/1000);
   this.rect.center = [this.x, this.y];

   if (this.x < 0) {
      this.x = this.scene.screen.getRect().right - 20;
   } else if (this.x > this.scene.screen.getRect().right) {
      this.x = 10;
   }
   if (this.y < 0) {
      this.y = this.scene.screen.getRect().bottom - 20;
   } else if (this.y > this.scene.screen.getRect().bottom) {
      this.y = 10;
   }

   // decrease speed if boosting
   if (this.speed > 60) {
      this.speed -= (10/this.speed) ;
   } else {
      this.speed = 60;
   }

   return;
}


Ship.prototype.turnBy = function(amount) {
   this.heading += amount
   if (this.heading > 360) this.heading = amount
   if (this.heading < 0) this.heading = 360 - amount
   this.image = gamejs.transform.rotate(this.imageMaster, this.heading);
   this.rect = this.image.getRect();
   return;
};

Ship.prototype.kill = function() {
   Planet.superClass.kill.apply(this, arguments);

   this.explosionGroup.add(new Explosion(this.rect.center));

}

/**
 * Rocket
 * dies if out of screen
 */
var Rocket = exports.Rocket = function(scene, position, angle) {
   Rocket.superConstructor.apply(this, arguments);

   this.scene = scene;
   this.setImage("images/rocket.png");
   this.setAngle(angle);
   this.setPosition(position);
   this.setSpeed(120);
   this.update(1);
   return this;
};
gamejs.utils.objects.extend(Rocket, gamejs.scene.MovingSprite);

Rocket.prototype.customUpdate = function() {
   if (!this.scene.screen.getRect().collidePoint(this.rect.center)) {
      this.kill(this);
   }
   return;
}

/**
 * Shuriken
 * dies if out of screen
 */
var Shuriken = exports.Shuriken  = function(scene, position, angle) {
   Shuriken.superConstructor.apply(this, arguments);

   this.scene = scene;
   this.setImage("images/shuriken.png");
   this.setAngle(angle);
   this.setPosition(position);
   this.setSpeed(parseInt(80 + (Math.random()*20), 10));
   this.update(1);
   return this;
};
gamejs.utils.objects.extend(Shuriken, gamejs.scene.MovingSprite);

Shuriken.prototype.customUpdate = function(msDuration) {
   this.rotateBy(15);
   if (!this.scene.screen.getRect().collidePoint(this.rect.center)) {
      this.kill(this);
   }
   return;
}


/**
 * Planet, randomly shoots rocket at player
 */
var Planet = exports.Planet = function(position, ship, shurikenGroup, explosionGroup, diamondGroup, scoreGroup, scene) {
   Planet.superConstructor.apply(this, arguments);

   this.scene = scene;
   this.shurikenGroup = shurikenGroup;
   this.scoreGroup = scoreGroup;
   this.diamondGroup = diamondGroup;
   this.scoreGroup = scoreGroup;
   this.explosionGroup = explosionGroup;
   this.ship = ship;

   this.image = gamejs.image.load("images/planet.png");
   this.rect = this.image.getRect();
   this.rect.center = position;
   return this;
}
gamejs.utils.objects.extend(Planet, gamejs.sprite.Sprite);

Planet.prototype.kill = function() {
   if (false) (new gamejs.mixer.Sound("sounds/explosion" + parseInt(Math.random()*1.5)+".ogg")).play()
   this.scoreGroup.add(new Scorepoints(this.rect.center, 100));
   this.diamondGroup.add(new Diamond(this.rect.center));
   this.explosionGroup.add(new Explosion(this.rect.center));
   Planet.superClass.kill.apply(this, arguments);
   return;
};

Planet.prototype.update = function() {
   Planet.superClass.update();
   // spawn rockets
   if (this.shurikenGroup.sprites().length < 10 && Math.random() < 0.01) {
      var dx = this.rect.center[0] - this.ship.rect.center[0];
      var dy = this.rect.center[1] - this.ship.rect.center[1];
      var radians = Math.atan2(dy, dx);
      var dir = radians * 180 / Math.PI;
      dir += 180;
      var shuriken = new Shuriken(this.scene, this.rect.center, dir);
      this.shurikenGroup.add(shuriken);
   }
   return;
};

/**
 * Explosion
 */
var Explosion = exports.Explosion = function(origin) {
   Explosion.superConstructor.apply(this, arguments);

   this.origin = origin;
   this.image = gamejs.image.load('images/fireball.png');
   var particles = [];
   [0,1,2,3].forEach(function() {
      var size = 2 + (Math.random() * 5)
      var px = origin[0] - (Math.random()*20);
      var py = origin[1] - (Math.random()*20);
      particles.push({
         'pos': [px, py],
         'size': size,
      })
   });

   this.update = function() {
      var tmpParts = [];
      particles.forEach(function(p) {
         p.size -= 0.5;
         if (p.size > 0) {
            tmpParts.push(p);
         }
      }, this);
      particles = tmpParts;
      if (particles.length <= 0) {
         this.kill();
      }
      return;
   }

   this.draw = function(surface) {
      particles.forEach(function(p) {
         surface.blit(gamejs.transform.scale(this.image, [p.size, p.size]), p.pos);
      }, this);
      return;
   };

   return this;
}
gamejs.utils.objects.extend(Explosion, gamejs.sprite.Sprite);

/**
 * Diamond, pickup brings points
 */

var Diamond = exports.Diamond = function(position) {
   Diamond.superConstructor.apply(this, arguments);

   this.image = gamejs.image.load('images/greendiamond_0.png');
   this.rect = this.image.getRect();
   this.rect.center = position;

   this.animationStep = 0;
   this.animationImages = [];
   [0,1,2,3,4,5].forEach(function(idx) {
      this.animationImages.push(gamejs.image.load('images/greendiamond_' + idx + '.png'));
   }, this);
   return this;
}
gamejs.utils.objects.extend(Diamond, gamejs.sprite.Sprite);

Diamond.prototype.update = function(msDuration) {
   this.animationStep++;
   if (this.animationStep > 5) {
      this.animationStep = 0;
   }
   this.image = this.animationImages[this.animationStep];
   return;
};

/**
 * Scorepoints
 */

var Scorepoints = exports.Scorepoints = function(position, points) {
   Scorepoints.superConstructor.apply(this, arguments);

   this.image = gamejs.image.load('images/' + points + 'points.png');
   this.rect = this.image.getRect();
   this.rect.center = position;
   this.scoreDy = 0;
   return this;
};
gamejs.utils.objects.extend(Scorepoints, gamejs.sprite.Sprite);

Scorepoints.prototype.update = function() {
   this.scoreDy += 3;
   this.rect.top = this.rect.top - 3;

   if (this.scoreDy > 50) {
      this.kill();
   }
   return;
};

/**
 * Gui - really just the timer & title
 */

var Gui = exports.Gui = function(scene, ship, planetGroup, initGameOver) {
   Gui.superConstructor.apply(this, arguments);

   var scoreFont = new gamejs.font.Font("20px Verdana");

   this.rect = new gamejs.Rect([0, 0]);
   var startTime = Date.now();
   this.diamondScore = 0;

   this.update = function() {

      this.timeLeft = parseInt((30000 - (Date.now() - startTime)) / 1000, 10);
      var planetsLeft = planetGroup.sprites().length;
      this.planetScore =  (10 - planetsLeft) * 100;
      this.score = 0;
      if (ship._alive === false || this.timeLeft <= 0 || planetsLeft <= 0) {
         var msg = 'Time ran out.';
         var timeBonus = 0;
         if (planetsLeft <= 0) {
            timeBonus = this.timeLeft * 75;
            this.score += timeBonus;
            msg = 'You destroyed all planets.';
         }
         if (ship._alive === false) {
            this.score -= 100;
            msg = '-100 Your ship was destroyed.';
         }
         totalScore = this.score + this.diamondScore + this.planetScore;
         initGameOver(totalScore, [
            {key: 'Planets', value:this.planetScore},
            {key: 'Diamonds', value: this.diamondScore},
            {key: 'Time Bonus', value:timeBonus},
            {key: 'msg', value: msg}
         ]);
      }
      return;
   }

   this.draw = function(surface) {
      surface.blit(scoreFont.render(this.timeLeft, '#e700d5'),[surface.getRect().width-28, 0] );

   }

   return this;
}

gamejs.utils.objects.extend(Gui, gamejs.sprite.Sprite);

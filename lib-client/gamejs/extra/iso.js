var Surface = require('gamejs').Surface;
var sprite = require('gamejs/sprite');
var image = require('gamejs/image');
var Rect = require('gamejs').Rect;
var objects = require('gamejs/utils/objects');


/** 
 * @fileoverview ISO 3D Sprites.
 *
 * 
 */

var DIRECTIONS = {
   n: {
      cartasian: [0, -1],
      angle: 270,
   },
   s: {
      cartasian: [0, 1],
      angle: 90,
   },
   w: {
      cartasian: [-1, 0],
      angle: 180,
   },
   e: {
      cartasian: [1, 0],
      angle: 0,
   },
   nw: {
      cartasian: [-1, -1],
      angle: 225,
   },
   ne: {
      cartasian: [1, -1],
      angle: 315,
   },
   sw: {
      cartasian: [-1, 1],
      angle: 135,
   },
   se: {
      cartasian: [1, 1],
      angle: 45,
   }
};

// cach for images per spritedir
var IMAGES = {};

// NOTE use Object.keys() once most browsers support it
var DIRECTIONS_SORTED = ['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w'];

/**
 * Animated Sprite
 *
 * @param {Object} animations
 * @param {fps} Frames Per Second for animations
 * @param {spritesPath} root path for sprites
 */
var AnimatedSprite = exports.AnimatedSprite = function(pos, animations, meta) {
   AnimatedSprite.superConstructor.apply(this, []);
      
   var dyingAnimation = meta.dying;
   var noLoopAnimations = meta.noLoop;
   var fps = meta.fps;
   var spritesPath = meta.rootPath;
   
   var animation = 'stopped';
   var animationStep = 0;
   var animationDirection = 's';
   var movementSpeed = meta.movementSpeed;
   var lastAnimationTime= null;
   var isDead = false;
      
   this.setAnimation = function(newAnimation) {
      if (!animation in animations) {
         throw new Error('unknown animation');
      }
      animation = newAnimation;
      animationStep = 0;
      var size = animations[animation].size;
      this.image = new Surface([size, size]);
      var oldCenter = this.rect.center;
      this.rect = this.image.getRect();
      this.rect.center = oldCenter;
      return;
   };
   this.getAnimation = function() {
      return animation;
   };

   this.setDirection = function(newDirection) {
      if (!newDirection in DIRECTIONS) {
         throw new Error('unknown direction');
      }
      animationDirection = newDirection;
      return;
   }

   this.update = function(msDuration) {
      var now = Date.now();
      var imageUpdate = false;
      if (lastAnimationTime === null || now - lastAnimationTime > 1000/fps) {
         animationStep++;
         lastAnimationTime = now;
         imageUpdate = true;
      }
      if (animationStep > animations[animation].count) {
         //  kill if this was the dying animation
         if (isDead === true) {
            AnimatedSprite.superClass.kill.apply(this);
            return;
         }
         // switch to stopped if this is a noLoop animation
         if (noLoopAnimations && noLoopAnimations.indexOf(animation) != -1) {
            this.setAnimation('stopped');
         }
         animationStep = 0;
         imageUpdate = true;
      }
      
      if (imageUpdate) {
         var size = animations[animation].size;
         // area within the spritemap
         var area = new Rect([
               size * animationStep,
               size * DIRECTIONS_SORTED.indexOf(animationDirection)
            ], [
               size,
               size
            ]
         );
         this.image.clear();
         this.image.blit(IMAGES[spritesPath][animation], new Rect(0,0,size,size), area);
      }      
      if (['walking', 'running'].indexOf(animation) !== -1) {
         var speed = animation === 'running' ? movementSpeed * 2 : movementSpeed;
         var speed = animationDirection.length > 1 ? speed * 0.7 : speed;
         
         center[0] += DIRECTIONS[animationDirection].cartasian[0] * speed;
         center[1] += DIRECTIONS[animationDirection].cartasian[1] * speed;
      }
      
      this.rect = this.image.getRect();
      this.rect.center = pos;
      this.customUpdate();
      return;
   };
   
   this.getDirection = function() {
      return animationDirection;
   }
   
   this.getAngle = function() {
      return dirToAngle[animationDirection];
   }
   
   this.kill = function(instant) {
      if (dyingAnimation && !instant) {
         isDead = true;
         this.setAnimation(dyingAnimation);
      } else {
         AnimatedSprite.superClass.kill.apply(this);  
      }
   };
   
   this.isDead = function() {
      return isDead;
   }
   
   this.isLastAnimationStep = function() {
      return animationStep >= animations[animation].count - 1;
   }
   
   this.setMovementSpeed = function(newSpeed) {
      movementSpeed = newSpeed;
      return;
   }
   
   /**
    * constructor
    */
   // sets image & RECT
   this.rect = new Rect(0,0);
   this.rect.center = pos;
   var center = pos;   
   this.setAnimation('stopped');
   
   if (!IMAGES[spritesPath]) {
      IMAGES[spritesPath] = {};
      for (var ani in animations) {
         IMAGES[spritesPath][ani] = image.load(getImagePath(spritesPath, ani));
      };
   }

      
   return this;
};
objects.extend(AnimatedSprite, sprite.Sprite);

/**
 * Overwrite for custom update()
 */
AnimatedSprite.prototype.customUpdate = function() {
};

function getImagePath(root, animation) {
   return root + animation.replace(' ', '%20') + '.png';
};

var gamejs = require('gamejs');
var sprite = require('gamejs/sprite');
var arrays = require('gamejs/utils/arrays');
/**
 * @fileoverview Provides `Sprite` the basic building block for any game and
 * `SpriteGroups`, which are an efficient
 * way for doing collision detection between groups as well as drawing layered
 * groups of objects on the screen.
 *
 */

/**
 * Your visible game objects will typically subclass Sprite. By setting it's image
 * and rect attributes you can control its appeareance. Those attributes control
 * where and what `Sprite.draw(surface)` will blit on the the surface.

 * Your subclass should overwrite `update(msDuration)` with its own implementation.
 * This function is called once every game tick, it is typically used to update
 * the status of that object.
 * @constructor
 */
var Sprite = exports.Sprite = function() {
   /** @ignore */
   this._groups = [];
   /** @ignore */
   this._alive = true;

   /**
    * Image to be rendered for this Sprite.
    * @type gamejs.Surface
    */
   this.image = null;
   /**
    * Rect describing the position of this sprite on the display.
    * @type gamejs.Rect
    */
   this.rect = null;

   return this;
};

Sprite.prototype.kill = function() {
   this._alive = false;
   this._groups.forEach(function(group) {
      group.remove(this);
   }, this);
   return;
};


Sprite.prototype.remove = function(groups) {
   if (!(groups instanceof Array)) groups = [groups];

   groups.forEach(function(group) {
      group.remove(this);
   }, this);
   return;
};

Sprite.prototype.add = function(groups) {
   if (!(groups instanceof Array)) groups = [groups];

   groups.forEach(function(group) {
      group.add(this);
   }, this);
   return;
};

Sprite.prototype.draw = function(surface) {
   surface.blit(this.image, this.rect);
   return;
};

// overload
Sprite.prototype.update = function() {};

Sprite.prototype.isDead = function() {
   return !this._alive;
};

/**
 * Sprites are often grouped. That makes collision detection more efficient and
 * improves rendering performance. It also allows you to easly keep track of layers
 * of objects which are rendered to the screen in a particular order.
 *
 * `Group.update()` calls `update()` on all the containing screens; the same is true for `draw()`.
 * @constructor
 */
var Group = exports.Group = function() {
   /** @ignore */
   this._sprites = [];


   if (arguments[0] instanceof Sprite ||
      (arguments[0] instanceof Array &&
       arguments[0].length &&
       arguments[0][0] instanceof Sprite
   )) {
      this.add(arguments[0]);
   }
   return this;
};

Group.prototype.update = function() {
   var updateArgs = arguments;

   this._sprites.forEach(function(sp) {
      sp.update.apply(sp, updateArgs);
   }, this);
   return;
};

Group.prototype.add = function(sprites) {
   if (!(sprites instanceof Array)) sprites = [sprites];

   sprites.forEach(function(sprite) {
      this._sprites.push(sprite);
      sprite._groups.push(this);
   }, this);
   return;
};

Group.prototype.remove = function(sprites) {
   if (!(sprites instanceof Array)) sprites = [sprites];

   sprites.forEach(function(sp) {
      arrays.remove(sp, this._sprites);
      arrays.remove(this, sp._groups);
   }, this);
   return;
};

Group.prototype.has = function(sprites) {
   if (!(sprites instanceof Array)) sprites = [sprites];

   return sprites.every(function(sp) {
      return this._sprites.indexOf(sp) !== -1;
   }, this);
};

Group.prototype.sprites = function() {
   return this._sprites;
}

Group.prototype.draw = function() {
   var args = arguments;
   this._sprites.forEach(function(sprite) {
      sprite.draw.apply(sprite, args);
   }, this);
   return;
};

Group.prototype.empty = function() {
   this._sprites = [];
   return;
};

/**
 * @returns {Array} of sprites colliding with the point
 */
Group.prototype.collidePoint = function() {
   var args = Array.prototype.slice.apply(arguments);
   return this._sprites.filter(function(sprite) {
      return sprite.rect.collidePoint.apply(sprite.rect, args);
   }, this);
}

Group.prototype.forEach = function() {
   Array.prototype.forEach.apply(this._sprites, arguments);
};

Group.prototype.some = function() {
   return Array.prototype.some.apply(this._sprites, arguments);
};

/**
 * find Sprites in a Group that intersect another Sprite
 */
exports.spriteCollide = function(sprite, group, doKill, collided) {
   var collided = collided || collideRect;
   var doKill = doKill || false;

   var collidingSprites = [];
   group.sprites().forEach(function(groupSprite) {
      if (collided(sprite, groupSprite)) {
         if (doKill) groupSprite.kill();

         collidingSprites.push(groupSprite);
      }
   });
   return collidingSprites;
};

/**
 * Find all Sprites that collide between two Groups.
 * Returns a list of objects with properties 'a', 'b', that hold
 * a ref to colliding objects from A and B.
 */
exports.groupCollide = function(groupA, groupB, doKillA, doKillB) {
   var doKillA = doKillA || false;
   var doKillB = doKillB || false;

   var collideList = [];

   groupA.sprites().forEach(function(groupSpriteA) {
      groupB.sprites().forEach(function(groupSpriteB) {
         if (collideRect(groupSpriteA, groupSpriteB)) {
            if (doKillA) groupSpriteA.kill();
            if (doKillB) groupSpriteB.kill();

            collideList.push({
               'a': groupSpriteA,
               'b': groupSpriteB
            });
         }
      });
   });

   return collideList;
};

/**
 * Collision detection between two sprites, using rects.
 */
var collideRect = exports.collideRect = function(spriteA, spriteB) {
   return spriteA.rect.collideRect(spriteB.rect);
};

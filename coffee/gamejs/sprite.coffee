gamejs = require('../gamejs')
arrays = require('./utils/arrays')
$o = require('./utils/objects')
$v = require('./utils/vectors')

###
 * @fileoverview Provides `Sprite` the basic building block for any game and
 * `SpriteGroups`, which are an efficient
 * way for doing collision detection between groups as well as drawing layered
 * groups of objects on the screen.
 *
 ###

###
 * Your visible game objects will typically subclass Sprite. By setting it's image
 * and rect attributes you can control its appeareance. Those attributes control
 * where and what `Sprite.draw(surface)` will blit on the the surface.
 *
 * Your subclass should overwrite `update(msDuration)` with its own implementation.
 * This function is called once every game tick, it is typically used to update
 * the status of that object.
 * @constructor
 ###
Sprite = exports.Sprite = () ->
  ### @ignore ###
  this._groups = []
  ### @ignore ###
  this._alive = true

  ###
   * Image to be rendered for this Sprite.
   * @type gamejs.Surface
   ###
  this.image = null
  ###
   * Rect describing the position of this sprite on the display.
   * @type gamejs.Rect
   ###
  this.rect = null

  ### List of all groups that contain this sprite.  ###
  $o.accessor(this, 'groups', () ->
    return this._groups
  )

  return this

###
 * Kill this sprite. This removes the sprite from all associated groups and
 * makes future calls to `Sprite.isDead()` return `true`
 ###
Sprite.prototype.kill = () ->
  this._alive = false
  this._groups.forEach((group) ->
    group.remove(this)
  , this)
  return


###
 * Remove the sprite from the passed groups
 * @param {Array|gamejs.sprite.Group} groups One or more `gamejs.Group`
 * instances
 ###
Sprite.prototype.remove = (groups) ->
  groups = [groups] if (!(groups instanceof Array))

  groups.forEach((group) ->
    group.remove(this)
  , this)
  return

###
 * Add the sprite to the passed groups
 * @param {Array|gamejs.sprite.Group} groups One or more `gamejs.sprite.Group`
 * instances
 ###
Sprite.prototype.add = (groups) ->
  if (!(groups instanceof Array))
    groups = [groups]

  groups.forEach((group) ->
    group.add(this)
  , this)
  return


###
 * Draw this sprite onto the given surface. The position is defined by this
 * sprite's rect.
 * @param {gamejs.Surface} surface The surface to draw on
 ###
Sprite.prototype.draw = (surface) ->
  surface.blit(this.image, this.rect)
  return

###
 * Update this sprite. You **should** override this method with your own to
 * update the position, status, etc.
 ###
Sprite.prototype.update = () ->

###
 * @returns {Boolean} True if this sprite has had `Sprite.kill()` called on it
 * previously, otherwise false
 ###
Sprite.prototype.isDead = () ->
  return !this._alive

###
 * Sprites are often grouped. That makes collision detection more efficient and
 * improves rendering performance. It also allows you to easly keep track of layers
 * of objects which are rendered to the screen in a particular order.
 *
 * `Group.update()` calls `update()` on all the contained sprites the same is true for `draw()`.
 * @constructor
 ###
Group = exports.Group = () ->
  ### @ignore ###
  this._sprites = []

  this.add(arguments[0]) if (arguments[0] instanceof Sprite ||
    (arguments[0] instanceof Array &&
      arguments[0].length &&
      arguments[0][0] instanceof Sprite))
     
  return this

###
 * Update all the sprites in this group. This is equivalent to calling the
 * update method on each sprite in this group.
 ###
Group.prototype.update = () ->
  updateArgs = arguments

  this._sprites.forEach((sp) ->
    sp.update.apply(sp, updateArgs)
  , this)
  return

###
 * Add one or more sprites to this group
 * @param {Array|gamejs.sprite.Sprite} sprites One or more
 * `gamejs.sprite.Sprite` instances
 ###
Group.prototype.add = (sprites) ->
  sprites = [sprites] if (!(sprites instanceof Array))

  sprites.forEach((sprite) ->
    this._sprites.push(sprite)
    sprite._groups.push(this)
  , this)
  return

###
 * Remove one or more sprites from this group
 * @param {Array|gamejs.sprite.Sprite} sprites One or more
 * `gamejs.sprite.Sprite` instances
 ###
Group.prototype.remove = (sprites) ->
  sprites = [sprites] if (!(sprites instanceof Array))

  sprites.forEach((sp) ->
    arrays.remove(sp, this._sprites)
    arrays.remove(this, sp._groups)
  , this)
  return

###
 * Check for the existence of one or more sprites within a group
 * @param {Array|gamejs.sprite.Sprite} sprites One or more
 * `gamejs.sprite.Sprite` instances
 * @returns {Boolean} True if every sprite is in this group, false otherwise
 ###
Group.prototype.has = (sprites) ->
  sprites = [sprites] if (!(sprites instanceof Array))

  return sprites.every((sp) ->
    return this._sprites.indexOf(sp) != -1
  , this)

###
 * Get the sprites in this group
 * @returns {Array} An array of `gamejs.sprite.Sprite` instances
 ###
Group.prototype.sprites = () ->
  return this._sprites

###
 * Draw all the sprites in this group. This is equivalent to calling each
 * sprite's draw method.
 ###
Group.prototype.draw = () ->
   args = arguments
   this._sprites.forEach((sprite) ->
      sprite.draw.apply(sprite, args)
   , this)
   return

###
 * Draw background (`source` argument) over each sprite in the group
 * on the `destination` surface.
 *
 * This can, for example, be used to clear the
 * display surface to a a static background image in all the places
 * occupied by the sprites of all group.
 *
 * @param {gamejs.Surface} destination the surface to draw on
 * @param {gamejs.Surface} source surface
 ###
Group.prototype.clear = (destination, source) ->
  this._sprites.forEach((sprite) ->
    destination.blit(source, sprite.rect)
  , this)

###
 * Remove all sprites from this group
 ###
Group.prototype.empty = () ->
  this._sprites = []
  return

###
 * @returns {Array} of sprites colliding with the point
 ###
Group.prototype.collidePoint = () ->
  args = Array.prototype.slice.apply(arguments)
  return this._sprites.filter((sprite) ->
    return sprite.rect.collidePoint.apply(sprite.rect, args)
  , this)

###
 * Loop over each sprite in this group. This is a shortcut for
 * `group.sprites().forEach(...)`.
 ###
Group.prototype.forEach = (callback, thisArg) ->
  return this._sprites.forEach(callback, thisArg)

###
 * Check whether some sprite in this group passes a test. This is a shortcut
 * for `group.sprites().some(...)`.
 ###
Group.prototype.some = (callback, thisArg) ->
  return this._sprites.some(callback, thisArg)


###
 * Find sprites in a group that intersect another sprite
 * @param {gamejs.sprite.Sprite} sprite The sprite to check
 * @param {gamejs.sprite.Group} group The group to check
 * @param {Boolean} doKill If true, kill sprites in the group when collided
 * @param {function} collided Collision function to use, defaults to `gamejs.sprite.collideRect`
 * @returns {Array} An array of `gamejs.sprite.Sprite` instances that collided
 ###
exports.spriteCollide = (sprite, group, doKill, collided) ->
  collided = collided || collideRect
  doKill = doKill || false

  collidingSprites = []
  group.sprites().forEach((groupSprite) ->
    if (collided(sprite, groupSprite))
      groupSprite.kill() if (doKill)
      collidingSprites.push(groupSprite)
  )
  return collidingSprites

###
 * Find all Sprites that collide between two Groups.
 *
 * @example
 * groupCollide(group1, group2).forEach(function (collision) {
 *    group1Sprite = collision.a
 *    group2Sprite = collision.b
 *    // Do processing here!
 * })
 *
 * @param {gamejs.sprite.Group} groupA First group to check
 * @param {gamejs.sprite.Group} groupB Second group to check
 * @param {Boolean} doKillA If true, kill sprites in the first group when
 * collided
 * @param {Boolean} doKillB If true, kill sprites in the second group when
 * collided
 * @param {function} collided Collision function to use, defaults to `gamejs.sprite.collideRect`
 * @returns {Array} A list of objects where properties 'a' and 'b' that
 * correspond with objects from the first and second groups
 ###
exports.groupCollide = (groupA, groupB, doKillA, doKillB, collided) ->
  doKillA = doKillA || false
  doKillB = doKillB || false

  collideList = []
  collideFn = collided || collideRect
  groupA.sprites().forEach((groupSpriteA) ->
    groupB.sprites().forEach((groupSpriteB) ->
      if (collideFn(groupSpriteA, groupSpriteB))
        groupSpriteA.kill() if (doKillA)
          
        groupSpriteB.kill() if (doKillB)

        collideList.push(
          a: groupSpriteA
          b: groupSpriteB
        )
    )
  )

  return collideList

###
 * Check for collisions between two sprites using their rects.
 *
 * @param {gamejs.sprite.Sprite} spriteA First sprite to check
 * @param {gamejs.sprite.Sprite} spriteB Second sprite to check
 * @returns {Boolean} True if they collide, false otherwise
 ###
collideRect = exports.collideRect = (spriteA, spriteB) ->
  return spriteA.rect.collideRect(spriteB.rect)

###
 * Collision detection between two sprites utilizing the optional `mask`
 * attribute on the sprites. Beware: expensive operation.
 *
 * @param {gamejs.sprite.Sprite} spriteA Sprite with 'mask' property set to a `gamejs.mask.Mask`
 * @param {gamejs.sprite.Sprite} spriteB Sprite with 'mask' property set to a `gamejs.mask.Mask`
 * @returns {Boolean} True if any mask pixels collide, false otherwise
 ###
exports.collideMask = (spriteA, spriteB) ->
  if (!spriteA.mask || !spriteB.mask)
    throw new Error("Both sprites must have 'mask' attribute set to an gamejs.mask.Mask")

  offset = [
    spriteB.rect.left - spriteA.rect.left
    spriteB.rect.top - spriteA.rect.top
  ]
  return spriteA.mask.overlap(spriteB.mask, offset)

###
 * Collision detection between two sprites using circles at centers.
 * There sprite property `radius` is used if present, otherwise derived from bounding rect.
 * @param {gamejs.sprite.Sprite} spriteA First sprite to check
 * @param {gamejs.sprite.Sprite} spriteB Second sprite to check
 * @returns {Boolean} True if they collide, false otherwise
 ###
exports.collideCircle = (spriteA, spriteB) ->
  rA = spriteA.radius || Math.max(spriteA.rect.width, spriteA.rect.height)
  rB = spriteB.radius || Math.max(spriteB.rect.width, spriteB.rect.height)
  return $v.distance(spriteA.rect.center, spriteB.rect.center) <= rA + rB

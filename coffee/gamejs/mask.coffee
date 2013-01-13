gamejs = require('../gamejs')
objects = require('./utils/objects')

###
 * @fileoverview Image masks. Usefull for pixel perfect collision detection.
 ###

###
 * Creates an image mask from the given Surface. The alpha of each pixel is checked
 * to see if it is greater than the given threshold. If it is greater then
 * that pixel is set as non-colliding.
 *
 * @param {gamejs.Surface} surface
 * @param {Number} threshold 0 to 255. defaults to: 255, fully transparent
 ###
exports.fromSurface = (surface, threshold) ->
  threshold = threshold && (255 - threshold) || 255
  imgData = surface.getImageData().data
  dims = surface.getSize()
  mask = new Mask(dims)
  #for (i=0i<imgData.length += 4)
  for i in [0..imgData.length] by 4
    ### y: pixel # / width ###
    y = parseInt((i / 4) / dims[0], 10)
    ### x: pixel # % width ###
    x = parseInt((i / 4) % dims[0], 10)
    alpha = imgData[i+3]
    if (alpha >= threshold)
      mask.setAt(x, y)
  return mask

###
 * Image Mask
 * @param {Array} dimensions [width, height]
 *
 ###
Mask = exports.Mask = (dims) ->
  ### @ignore ###
  this.width = dims[0]
  ### @ignore ###
  this.height = dims[1]
  ### @ignore ###
  this._bits = []
  #for (i=0; i<this.width; i++)
  for i in [0...this.width]
    this._bits[i] = []
    #for (j=0;j<this.height; j++)
    for j in [0...this.height]
      this._bits[i][j] = false
  return

###
 * @param {gamejs.mask.Mask} otherMask
 * @param {Array} offset [x,y]
 * @returns the overlapping rectangle or null if there is no overlap
 ###
Mask.prototype.overlapRect = (otherMask, offset) ->
  arect = this.rect
  brect = otherMask.rect

  brect.moveIp(offset) if (offset)

  ### bounding box intersect ###
  return null if (!brect.collideRect(arect))

  xStart = Math.max(arect.left, brect.left)
  xEnd = Math.min(arect.right, brect.right)

  yStart = Math.max(arect.top, brect.top)
  yEnd = Math.min(arect.bottom, brect.bottom)

  return new gamejs.Rect([xStart, yStart], [xEnd - xStart, yEnd - yStart])

###
 *
 * @returns True if the otherMask overlaps with this map.
 * @param {Mask} otherMask
 * @param {Array} offset
 ###
Mask.prototype.overlap = (otherMask, offset) ->
  overlapRect = this.overlapRect(otherMask, offset)
  return false if (overlapRect == null)

  arect = this.rect
  brect = otherMask.rect
  
  brect.moveIp(offset) if (offset)

  count = 0
  #for (y=overlapRect.top; y<=overlapRect.bottom; y++)
  for y in [overlapRect.top..overlapRect.bottom]
    #for (x=overlapRect.left; x<=overlapRect.right; x++)
    for x in [overlapRect.left..overlapRect.right]
      return true if (this.getAt(x - arect.left, y - arect.top) &&
        otherMask.getAt(x - brect.left, y - brect.top))
        ###
NOTE this should not happen because either we bailed out
long ago because the rects do not overlap or there is an
overlap and we should not have gotten this far.
throw new Error("Maks.overlap: overlap detected but could not create mask for it.")
###
  return false

###
 * @param {gamejs.mask.Mask} otherMask
 * @param {Array} offset [x,y]
 * @returns the number of overlapping pixels
 ###
Mask.prototype.overlapArea = (otherMask, offset) ->
  overlapRect = this.overlapRect(otherMask, offset)
  return 0 if (overlapRect == null)

  arect = this.rect
  brect = otherMask.rect
 
  brect.moveIp(offset) if (offset)

  count = 0
  #for (y=overlapRect.top; y<=overlapRect.bottom; y++)
  for y in [overlapRect.top..overlapRect.bottom]
  #  for (x=overlapRect.left; x<=overlapRect.right; x++)
    for x in [overlapRect.left..overlapRect.right]
      count++ if (this.getAt(x - arect.left, y - arect.top) &&
        otherMask.getAt(x - brect.left, y - brect.top))
  return count

###
 * @param {gamejs.mask.Mask} otherMask
 * @param {Array} offset [x,y]
 * @returns a mask of the overlapping pixels
 ###
Mask.prototype.overlapMask = (otherMask, offset) ->
  overlapRect = this.overlapRect(otherMask, offset)
  return 0 if (overlapRect == null)

  arect = this.rect
  brect = otherMask.rect
 
  brect.moveIp(offset) if (offset)

  mask = new Mask([overlapRect.width, overlapRect.height])
  #for (y=overlapRect.top y<=overlapRect.bottom y++)
  for y in [overlapRect.top..overlapRect.bottom]
    #for (x=overlapRect.left x<=overlapRect.right x++)
    for x in [overlapRect.left..overlapRect.right]
      mask.setAt(x, y) if (this.getAt(x - arect.left, y - arect.top) &&
      otherMask.getAt(x - brect.left, y - brect.top))
            
  return mask

###
 * Set bit at position.
 * @param {Number} x
 * @param {Number} y
 ###
Mask.prototype.setAt = (x, y) ->
  this._bits[x][y] = true

###
 * Get bit at position.
 *
 * @param {Number} x
 * @param {Number} y
 ###
Mask.prototype.getAt = (x, y) ->
  x = parseInt(x, 10)
  y = parseInt(y, 10)
  return false if (x < 0 || y < 0 || x >= this.width || y >= this.height)
  return this._bits[x][y]


###
 * Flip the bits in this map.
 ###
Mask.prototype.invert = () ->
  this._bits = this._bits.map((row) ->
    return row.map((b) ->
      return !b
    )
  )

###
 * @returns {Array} the dimensions of the map
 ###
Mask.prototype.getSize = () ->
  return [this.width, this.height]

objects.accessors(Mask.prototype,
  ###
   * Rect of this Mask.
   ###
  rect:
    get: () ->
      return new gamejs.Rect([0, 0], [this.width, this.height])
  ,
  ###
   * @returns {Number} number of set pixels in this mask.
   ###
  length:
    get: () ->
      c = 0
      this._bits.forEach((row) ->
        row.forEach((b) ->
          c++ if (b)
        )
      )
      return c
)

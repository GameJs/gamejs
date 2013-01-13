Surface = require('../gamejs').Surface
matrix = require('./utils/matrix')
math = require('./utils/math')
vectors = require('./utils/vectors')

###
 * @fileoverview Rotate and scale Surfaces.
 ###

###
 * Returns a new surface which holds the original surface rotate by angle degrees.
 * Unless rotating by 90 degree increments, the image will be padded larger to hold the new size.
 * @param {Surface} surface
 * @param {angel} angle Clockwise angle by which to rotate
 * @returns {Surface} new, rotated surface
 ###
exports.rotate = (surface, angle) ->
  origSize = surface.getSize()
  radians = (angle * Math.PI / 180)
  newSize = origSize
  # find new bounding box
  if (angle % 360 != 0)
    rect = surface.getRect()
    points = [
       [-rect.width/2, rect.height/2],
       [rect.width/2, rect.height/2],
       [-rect.width/2, -rect.height/2],
       [rect.width/2, -rect.height/2]
    ]
    rotPoints = points.map((p) ->
      return vectors.rotate(p, radians)
    )
    xs = rotPoints.map((p) -> return p[0] )
    ys = rotPoints.map((p) -> return p[1] )
    left   = Math.min.apply(Math, xs)
    right  = Math.max.apply(Math, xs)
    bottom = Math.min.apply(Math, ys)
    top    = Math.max.apply(Math, ys)
    newSize = [right-left, top-bottom]

  newSurface = new Surface(newSize)
  oldMatrix = surface._matrix
  surface._matrix = matrix.translate(surface._matrix, origSize[0]/2, origSize[1]/2)
  surface._matrix = matrix.rotate(surface._matrix, radians)
  surface._matrix = matrix.translate(surface._matrix, -origSize[0]/2, -origSize[1]/2)
  offset = [(newSize[0] - origSize[0]) / 2, (newSize[1] - origSize[1]) / 2]
  newSurface.blit(surface, offset)
  surface._matrix = oldMatrix
  return newSurface

###
 * Returns a new surface holding the scaled surface.
 * @param {Surface} surface
 * @param {Array} dimensions new [width, height] of surface after scaling
 * @returns {Surface} new, scaled surface
 ###
exports.scale = (surface, dims) ->
  width  = dims[0]
  height = dims[1]
  if (width <= 0 || height <= 0)
    throw new Error('[gamejs.transform.scale] Invalid arguments for height and width', [width, height])

  oldDims = surface.getSize()
  ws = width / oldDims[0]
  hs = height / oldDims[1]
  newSurface = new Surface([width, height])
  originalMatrix = surface._matrix.slice(0)
  surface._matrix = matrix.scale(surface._matrix, [ws, hs])
  newSurface.blit(surface)
  surface._matrix = originalMatrix
  return newSurface

###
 * Flip a Surface either vertically, horizontally or both. This returns
 * a new Surface (i.e: nondestructive).
 * @param {gamejs.Surface} surface
 * @param {Boolean} flipHorizontal
 * @param {Boolean} flipVertical
 * @returns {Surface} new, flipped surface
 ###
exports.flip = (surface, flipHorizontal, flipVertical) ->
  dims = surface.getSize()
  newSurface = new Surface(dims)
  scaleX = 1
  scaleY = 1
  xPos = 0
  yPos = 0
  if (flipHorizontal == true)
    scaleX = -1
    xPos = -dims[0]
  if (flipVertical == true)
    scaleY = -1
    yPos = -dims[1]
  
  newSurface.context.save()
  newSurface.context.scale(scaleX, scaleY)
  newSurface.context.drawImage(surface.canvas, xPos, yPos)
  newSurface.context.restore()
  return newSurface

###
 * @fileoverview Matrix manipulation, used by GameJs itself. You
 * probably do not need this unless you manipulate a Context's transformation
 * matrix yourself.
 ###

# correct way to do scale, rotate, translate
# *  gamejs.utils.matrix will be used in gamejs.transforms, modifing the surfaces.matrix
# * this matrix must be applied to the context in Surface.draw()

###
 * @returns {Array} [1, 0, 0, 1, 0, 0]
 ###
identiy = exports.identity = () ->
  return [1, 0, 0, 1, 0, 0]

###
 * @param {Array} matrix
 * @param {Array} matrix
 * @returns {Array} matrix sum
 ###
add = exports.add = (m1, m2) ->
  return [
    m1[0] + m2[0]
    m1[1] + m2[1]
    m1[2] + m2[2]
    m1[3] + m2[3]
    m1[4] + m2[4]
    m1[5] + m2[5]
    m1[6] + m2[6]
  ]

###
 * @param {Array} matrix A
 * @param {Array} matrix B
 * @returns {Array} matrix product
 ###
multiply = exports.multiply = (m1, m2) ->
  return [
    m1[0] * m2[0] + m1[2] * m2[1]
    m1[1] * m2[0] + m1[3] * m2[1]
    m1[0] * m2[2] + m1[2] * m2[3]
    m1[1] * m2[2] + m1[3] * m2[3]
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4]
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ]

###
 * @param {Array} matrix
 * @param {Number} dx
 * @param {Number} dy
 * @returns {Array} translated matrix
 ###
translate = exports.translate = (m1, dx, dy) ->
  return multiply(m1, [1, 0, 0, 1, dx, dy])

###
 * @param {Array} matrix
 * @param {Number} angle in radians
 * @returns {Array} rotated matrix
 ###
rotate = exports.rotate = (m1, angle) ->
  # radians
  sin = Math.sin(angle)
  cos = Math.cos(angle)
  return multiply(m1, [cos, sin, -sin, cos, 0, 0])

###
 * @param {Array} matrix
 * @returns {Number} rotation in radians
 ###
rotation = exports.rotation = (m1) ->
  return Math.atan2(m1[1], m1[0])

###
 * @param {Array} matrix
 * @param {Array} vector [a, b]
 * @returns {Array} scaled matrix
 ###
scale = exports.scale = (m1, svec) ->
  sx = svec[0]
  sy = svec[1]
  return multiply(m1, [sx, 0, 0, sy, 0, 0])

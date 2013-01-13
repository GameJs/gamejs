###
 *
 * absolute angle to relative angle, in degrees
 * @param {Number} absolute angle in degrees
 * @returns {Number} relative angle in degrees
 ###
exports.normaliseDegrees = (degrees) ->
  degrees = degrees % 360
  degrees += 360 if(degrees<0)
  return degrees

###
 *
 * absolute angle to relative angle, in radians
 * @param {Number} absolute angle in radians
 * @returns {Number} relative angle in radians
 ###
exports.normaliseRadians = (radians) ->
  radians=radians % (2*Math.PI)
  radians+=(2*Math.PI) if(radians<0)
  return radians

###
 *
 * convert radians to degrees
 * @param {Number} radians
 * @returns {Number} degrees
 ###
exports.degrees = (radians) ->
  return radians*(180/Math.PI)

###
 *
 * convert degrees to radians
 * @param {Number} degrees
 * @returns {Number} radians
 ###
exports.radians = (degrees) ->
  return degrees*(Math.PI/180)

###
 * @returns the center of multipled 2d points
 * @param {Array} first point
 * @param {Array} second point
 * @param {Array} ...
 ###
exports.centroid = () ->
  args = Array.prototype.slice.apply(arguments, [0])
  c = [0,0]
  args.forEach((p)
    c[0] += parseInt(p[0], 10)
    c[1] += parseInt(p[1], 10)
  )
  len = args.length
  return [
    c[0] / len
    c[1] / len
  ]

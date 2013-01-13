###
 * @fileoverview
 * A noise generator comparable to Perlin noise, which is useful
 * for generating procedural content.
 * @see gamejs/utils/prng
 ###

###
 Ported to JS by by zz85 <https:#github.com/zz85> from Stefan
 Gustavson's java implementation
 <http:#staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf>
 Read Stefan's excellent paper for details on how this code works.

 Sean McCullough banksean@gmail.com
###

###
 * This implementation provides 2D and 3D noise. You can optionally
 * pass a seedable pseudo-random number generator to its constructor. This
 * generator object is assumed to have a `random()` method `Math` is used
 * per default.
 *
 * Also see `gamejs/utils/prng` for a seedable pseudo random number generator
 *
 * @param {Object} prng the random number generator to use most provide `random()` method
 * @usage
 *  simplex = new gamejs.noise.Simplex()
 *  simplex.get(x, y)
 *  # or for 3d noise
 *  simple.get(x, y, y)
 ###
Simplex = exports.Simplex = (r) ->
  r = Math if (r == undefined)
  ### @ignore ###
  this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
               [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
               [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]
  ### @ignore ###
  this.p = []
  #for (i=0 i<256 i++)
  for i in [0...256]
    this.p[i] = Math.floor(r.random()*256)
  ### To remove the need for index wrapping, double the permutation table length ###
  ### @ignore ###
  this.perm = []
  #for(i=0 i<512 i++)
  for i in [0...512]
    this.perm[i]=this.p[i & 255]

  ###
A lookup table to traverse the simplex around a given point in 4D.
Details can be found where this table is used, in the 4D noise method.
###
  ### @ignore ###
  this.simplex = [
    [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
    [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
    [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
    [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
    [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
    [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]
  
  return this

### @ignore ###
Simplex.prototype.dot = (g, x, y) ->
  return g[0]*x + g[1]*y

###
 * @param {Number} x
 * @param {Number} y
 * @returns {Number} noise for given position, in range [-1, 1]
 ###
Simplex.prototype.get = (xin, yin) ->
  # Noise contributions from the three corners
  ### Skew the input space to determine which simplex cell we're in ###
  F2 = 0.5*(Math.sqrt(3.0)-1.0)
  s = (xin+yin)*F2 # Hairy factor for 2D
  i = Math.floor(xin+s)
  j = Math.floor(yin+s)
  G2 = (3.0-Math.sqrt(3.0))/6.0
  t = (i+j)*G2
  X0 = i-t # Unskew the cell origin back to (x,y) space
  Y0 = j-t
  x0 = xin-X0 # The x,y distances from the cell origin
  y0 = yin-Y0
  # For the 2D case, the simplex shape is an equilateral triangle.
  # Determine which simplex we are in.
  #i1, j1 # Offsets for second (middle) corner of simplex in (i,j) coords
  if(x0>y0)
    i1=1
    j1=0 # lower triangle, XY order: (0,0)->(1,0)->(1,1)
  else
    i1=0
    j1=1  # upper triangle, YX order: (0,0)->(0,1)->(1,1)
  # A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  # a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  # c = (3-sqrt(3))/6
  x1 = x0 - i1 + G2 # Offsets for middle corner in (x,y) unskewed coords
  y1 = y0 - j1 + G2
  x2 = x0 - 1.0 + 2.0 * G2 # Offsets for last corner in (x,y) unskewed coords
  y2 = y0 - 1.0 + 2.0 * G2
  # Work out the hashed gradient indices of the three simplex corners
  ii = i & 255
  jj = j & 255
  gi0 = this.perm[ii+this.perm[jj]] % 12
  gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12
  gi2 = this.perm[ii+1+this.perm[jj+1]] % 12
  # Calculate the contribution from the three corners
  t0 = 0.5 - x0*x0-y0*y0
  if(t0<0)
    n0 = 0.0
  else
    t0 *= t0
    n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0) # (x,y) of grad3 used for 2D gradient
  t1 = 0.5 - x1*x1-y1*y1
  if(t1<0)
    n1 = 0.0
  else
    t1 *= t1
    n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1)
  
  t2 = 0.5 - x2*x2-y2*y2
  if(t2<0)
    n2 = 0.0
  else
    t2 *= t2
    n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2)
  
  # Add contributions from each corner to get the final noise value.
  # The result is scaled to return values in the interval [-1,1].
  return 70.0 * (n0 + n1 + n2)


###
 * @param {Number} x
 * @param {Number} y
 * @param {Number} y
 * @returns {Number} noise for given position, in range [-1, 1]
 ###
Simplex.prototype.get3d = (xin, yin, zin) ->
  #n0, n1, n2, n3 # Noise contributions from the four corners
  # Skew the input space to determine which simplex cell we're in
  F3 = 1.0/3.0
  s = (xin+yin+zin)*F3 # Very nice and simple skew factor for 3D
  i = Math.floor(xin+s)
  j = Math.floor(yin+s)
  k = Math.floor(zin+s)
  G3 = 1.0/6.0 # Very nice and simple unskew factor, too
  t = (i+j+k)*G3
  X0 = i-t # Unskew the cell origin back to (x,y,z) space
  Y0 = j-t
  Z0 = k-t
  x0 = xin-X0 # The x,y,z distances from the cell origin
  y0 = yin-Y0
  z0 = zin-Z0
  # For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  # Determine which simplex we are in.
  #i1, j1, k1 # Offsets for second corner of simplex in (i,j,k) coords
  #i2, j2, k2 # Offsets for third corner of simplex in (i,j,k) coords
  if(x0>=y0)
    if(y0>=z0)
      i1=1
      j1=0
      k1=0
      i2=1
      j2=1
      k2=0 # X Y Z order
    else if(x0>=z0)
      i1=1
      j1=0
      k1=0
      i2=1
      j2=0
      k2=1 # X Z Y order
    else
      i1=0
      j1=0
      k1=1
      i2=1
      j2=0
      k2=1 # Z X Y order
  else # x0<y0
    if(y0<z0)
      i1=0
      j1=0
      k1=1
      i2=0
      j2=1
      k2=1 # Z Y X order
    else if(x0<z0)
      i1=0
      j1=1
      k1=0
      i2=0
      j2=1
      k2=1 # Y Z X order
    else
      i1=0
      j1=1
      k1=0
      i2=1
      j2=1
      k2=0 # Y X Z order
  # A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
  # a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
  # a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
  c = 1/6.
  x1 = x0 - i1 + G3 # Offsets for second corner in (x,y,z) coords
  y1 = y0 - j1 + G3
  z1 = z0 - k1 + G3
  x2 = x0 - i2 + 2.0*G3 # Offsets for third corner in (x,y,z) coords
  y2 = y0 - j2 + 2.0*G3
  z2 = z0 - k2 + 2.0*G3
  x3 = x0 - 1.0 + 3.0*G3 # Offsets for last corner in (x,y,z) coords
  y3 = y0 - 1.0 + 3.0*G3
  z3 = z0 - 1.0 + 3.0*G3
  # Work out the hashed gradient indices of the four simplex corners
  ii = i & 255
  jj = j & 255
  kk = k & 255
  gi0 = this.perm[ii+this.perm[jj+this.perm[kk]]] % 12
  gi1 = this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]] % 12
  gi2 = this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]] % 12
  gi3 = this.perm[ii+1+this.perm[jj+1+this.perm[kk+1]]] % 12
  # Calculate the contribution from the four corners
  t0 = 0.6 - x0*x0 - y0*y0 - z0*z0
  if(t0<0)
    n0 = 0.0
  else
    t0 *= t0
    n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0)

  t1 = 0.6 - x1*x1 - y1*y1 - z1*z1
  if(t1<0)
    n1 = 0.0
  else
    t1 *= t1
    n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1)

  t2 = 0.6 - x2*x2 - y2*y2 - z2*z2
  if(t2<0)
    n2 = 0.0
  else
    t2 *= t2
    n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2)

  t3 = 0.6 - x3*x3 - y3*y3 - z3*z3
  if(t3<0)
    n3 = 0.0
  else
    t3 *= t3
    n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3)
 
  # Add contributions from each corner to get the final noise value.
  # The result is scaled to stay just inside [-1,1]
  return 32.0*(n0 + n1 + n2 + n3)

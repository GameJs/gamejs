###
 * @fileoverview A seedable random-number generator. Especially
 * useful in conjunction with the noise generator in `gamejs/utils/noise`.
 *
 ###
# From http:#baagoe.com/en/RandomMusings/javascript/
# Johannes Baagøe <baagoe@baagoe.com>, 2010
# API modified by Simon Oberhammer <simon@nekapuzer.at>, 2012
# discussion of the used algorithms <http:#baagoe.org/en/w/index.php/Better_random_numbers_for_javascript>


### @ignore ###
Mash = exports.Mash = () ->
  n = 0xefc8249d
  this.hash = (data) ->
    data = data.toString()
    for i in [0...data.length]
      n += data.charCodeAt(i)
      h = 0.02519603282416938 * n
      n = h >>> 0
      h -= n
      h *= n
      n = h >>> 0
      h -= n
      n += h * 0x100000000 # 2^32
    return (n >>> 0) * 2.3283064365386963e-10 # 2^-32

  this.version = 'Mash 0.9'
  return this

###
 * A seedable pseudo-random number generator.
 * @param {Number|String} seed the seed for generating the numbers
 *
 * @usage
 *  prng = require('gamejs/utils/prng')
 *  seed = 'gamejs'
 *  alea = new prng.Alea(seed)
 *  alea.random() # 0.6765871671959758
 *  alea.random() # 0.15881546027958393
 *
 *  # generator with the same seed will generate the same sequence
 *  # of numbers:
 *  aleaTwo = new prng.Alea(seed)
 *  aleaTwo.random() # 0.6765871671959758
 *  aleaTwo.random() # 0.15881546027958393
 ###
Alea = exports.Alea = () ->
  args = Array.prototype.slice.call(arguments)
  s0 = 0
  s1 = 0
  s2 = 0
  c = 1
  args = [+new Date] if (args.length == 0)
  mash = new Mash()
  s0 = mash.hash(' ')
  s1 = mash.hash(' ')
  s2 = mash.hash(' ')

  for i in [0...args.length]
    s0 -= mash.hash(args[i])
    s0 += 1 if (s0 < 0)
     
    s1 -= mash.hash(args[i])
    s1 += 1 if (s1 < 0)
    s2 -= mash.hash(args[i])
    s2 += 1 if (s2 < 0)
      
  mash = null

  ###
   * @returns {Number} the next random number as determined by the seed
   ###
  this.random = () ->
    t = 2091639 * s0 + c * 2.3283064365386963e-10 # 2^-32
    s0 = s1
    s1 = s2
    return s2 = t - (c = t | 0)
  return this

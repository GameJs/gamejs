###
 * @fileoverview Utility functions for working with Obiects
 * @param {Object} item
 * @param {Array} array
 * @param {Object} returns removed item or null
 ###

exports.remove = (item, array) ->
  index = array.indexOf(item)
  if (index != -1)
    return array.splice(array.indexOf(item), 1)
  return null

###
 * Shuffles the array *in place*.
 * @see http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 ###
exports.shuffle = (array) ->
  len = array.length -1
  #for (i = len i > 0 i--)
  for i in [len..0]
    idx = parseInt(Math.random() * (i + 1))
    item = array[i]
    array[i] = array[idx]
    array[idx] = item
  return array

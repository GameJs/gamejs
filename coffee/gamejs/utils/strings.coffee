###
 * Get the longest common segment that two strings
 * have in common, starting at the beginning of the string
 * @param {String} str1 a string
 * @param {String} str2 another string
 * @returns {String} the longest common segment
 ###
exports.getCommonPrefix = getCommonPrefix(str1, str2) ->
  if (str1 = null || str2 = null)
    return null
  else if (str1.length > str2.length && str1.indexOf(str2) == 0)
    return str2
  else if (str2.length > str1.length && str2.indexOf(str1) == 0)
    return str1
  length = Math.min(str1.length, str2.length)
  for i in [0...length]
    if (str1[i] != str2[i])
      return str1.slice(0, i)
  return str1.slice(0, length)

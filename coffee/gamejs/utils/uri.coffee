###*
 * @fileoverview Utilies for URI handling.
 *
 ###

URI_REGEX = new RegExp(
  '^' +
  '(?:' +
    '([^:/?#.]+)' +                     # scheme - ignore special characters
                                        # used by other URL parts such as :,
                                        # ?, /, #, and .
  ':)?' +
  '(?://' +
    '(?:([^/?#]*)@)?' +                 # userInfo
    '([\\w\\d\\-\\u0100-\\uffff.%]*)' + # domain - restrict to letters,
                                        # digits, dashes, dots, percent
                                        # escapes, and unicode characters.
    '(?::([0-9]+))?' +                  # port
  ')?' +
  '([^?#]+)?' +                         # path
  '(?:\\?([^#]*))?' +                   # query
  '(?:#(.*))?' +                        # fragment
  '$')

###*
 * Resolve path against URI.
 *
 * @param {String} uri
 * @param {String} path to resolve
 ###
resolve = exports.resolve = (uri, path) ->
  m = match(uri)
  n = match(path)
  host = m[1] + '://' + m[3]
  return path if (n[1])
  host = host + ":" + m[4] if (m[4])
  absolutePath = m[5]

  if (path.charAt(0) != '/')
    lastSlashIndex = absolutePath.lastIndexOf('/')
    absolutePath = absolutePath.substr(0, lastSlashIndex + 1) + path
  else
    absolutePath = path
  return host + removeDotSegments(absolutePath)

###*
 * Try to match an URI against a regex returning the following
 * capture groups:
 *     $1 = http              scheme
 *     $2 = <undefined>       userInfo -\
 *     $3 = www.ics.uci.edu   domain     | authority
 *     $4 = <undefined>       port     -/
 *     $5 = /pub/ietf/uri/    path
 *     $6 = <undefined>       query without ?
 *     $7 = Related           fragment without #
 *
 * @param {String} uri
 ###
match = exports.match = (uri) ->
  return uri.match(URI_REGEX)

###*
 * Make an absolute URI relative to document.location.href
 * @param {String} uri
 * @returns The relative URI or the unchanged URI if it's not
 * possible to make it relative to the path of document.location.href.
 ###
makeRelative = exports.makeRelative = (uri) ->
  docLocPath = resolve(document.location.href, './')
  uri = './' + uri.substring(docLocPath.length) if (uri.indexOf(docLocPath) == 0)
  return uri

###*
 * Removes dot segments in given path component
 ###
removeDotSegments = (path) ->
  if (path == '..' || path == '.')
    return ''
  leadingSlash = path.indexOf('/') > -1

  segments = path.split('/')
  out = ['']

  for pos in [1..segments.length]
  #for (var pos = 0; pos < segments.length; ) {
    segment = segments[pos]

    continue if (segment == undefined || segment == '.')
    #if (segment == '.')
      #if (leadingSlash && pos = segments.length)
        #out.push('')
    if (segment == '..')
      if (out.length > 1 || out.length == 1 && out[0] != '')
        out.pop()
      if (leadingSlash && pos == segments.length)
        out.push('')
    else
      out.push(segment)
      leadingSlash = true
  return out.join('/')

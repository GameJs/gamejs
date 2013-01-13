###
 * @fileoverview Utility functions for working with Objects
 ###

###
 * Put a prototype into the prototype chain of another prototype.
 * @param {Object} subClass
 * @param {Object} superClass
 ###
exports.extend = (subClass, superClass) ->
  throw new Error('unknown subClass') if (subClass == undefined)
    
  throw new Error('unknown superClass') if (superClass == undefined)
  # new Function() is evil
  f = new Function()
  f.prototype = superClass.prototype

  subClass.prototype = new f()
  subClass.prototype.constructor = subClass
  subClass.superClass = superClass.prototype
  subClass.superConstructor = superClass
  return

###
 * Creates a new object as the as the keywise union of the provided objects.
 * Whenever a key exists in a later object that already existed in an earlier
 * object, the according value of the earlier object takes precedence.
 * @param {Object} obj... The objects to merge
 ###
exports.merge = (args...) ->
  result = {}
  #for i in args.length i > 0 --i)
  for i in [args.length...0]
    obj = args[i - 1]
    for property in obj
      result[property] = obj[property]
  return result

###
 * fallback for Object.keys
 * @param {Object} obj
 * @returns {Array} list of own properties
 * @see https:#developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
 ###
keys = exports.keys = (obj) ->
   return Object.keys(obj) if (Object.keys)

   ret = []
   for p of obj
     ret.push(p) if(Object.prototype.hasOwnProperty.call(obj, p))
   return ret

###
 * Create object accessors
 * @param {Object} object The object on which to define the property
 * @param {String} name name of the property
 * @param {Function} get
 * @param {Function} set
 * @see https:#developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty
 ###
accessor = exports.accessor = (object, name, get, set) ->
  # ECMA5
  if (Object.defineProperty != undefined)
     Object.defineProperty(object, name,
        get: get
        set: set
     )
  # non-standard
  else if (Object.prototype.__defineGetter__ != undefined)
    object.__defineGetter__(name, get)
    if (set)
      object.__defineSetter__(name, set)
  return

###
 * @param {Object} object The object on which to define or modify properties.
 * @param {Object} props An object whose own enumerable properties constitute descriptors for the properties to be defined or modified.
 * @see https:#developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperties
 ###
exports.accessors = (object, props) ->
  keys(props).forEach((propKey) ->
    accessor(object, propKey, props[propKey].get, props[propKey].set)
  )
  return

###
 * @fileoverview
 * Provides tools for game time managment.
 *
 * This is very different from how PyGame works. We can not
 * pause the execution of the script in Browser JavaScript, so what
 * we do you do is write a main function which contains the code
 * you would put into your main loop and pass that to `fpsCallback()`:
 *
 * @example
 *     function main() {
 *         // update models
 *         // draw to screen
 *      }
 *      gamejs.time.fpsCallback(main, this, 30)
 *      
 *      function aiUpdate() {
 *         // do stuff that needs low update rates
 *      }
 *      gamejs.time.fpsCallback(aiUpdate, this, 10)
 *
 *
 ###


TIMER_LASTCALL = null
CALLBACKS = {}
CALLBACKS_LASTCALL = {}
TIMER = null
STARTTIME = null

### @ignore ###
exports.init = () ->
  STARTTIME = Date.now()
  TIMER = setInterval(perInterval, 10)
  return

###
 * @param {Function} fn the function to call back
 * @param {Object} thisObj `this` will be set to that object when executing the function
 * @param {Number} fps specify the framerate by which you want the callback to be called. (e.g. 30 = 30 times per seconds). default: 30
 ###
exports.fpsCallback = (fn, thisObj, fps) ->
  fps = 30 if ( fps == undefined )
   
  fps = parseInt(1000/fps, 10)
  CALLBACKS[fps] = CALLBACKS[fps] || []
  CALLBACKS_LASTCALL[fps] = CALLBACKS_LASTCALL[fps] || 0

  CALLBACKS[fps].push({
    'rawFn': fn,
    'callback': (msWaited) ->
      fn.apply(thisObj, [msWaited])
    }
  )
  return

###
 * @param {Function} callback the function delete
 * @param {Number} fps
 ###
exports.deleteCallback = (callback, fps) ->
  result = null
  fps = parseInt(1000/fps, 10)
  callbacks = CALLBACKS[fps]
  if (callbacks)
    CALLBACKS[fps] = callbacks.filter((fnInfo, idx) ->
      result = (fnInfo.rawFn != callback)
    )
  return result

perInterval = () ->
  msNow = Date.now()
  lastCalls = CALLBACKS_LASTCALL
  callbackWrapper = (fnInfo) ->
    fnInfo.callback(msWaited)
  for fpsKey of lastCalls
    CALLBACKS_LASTCALL[fpsKey] = msNow if (!lastCalls[fpsKey])
    msWaited = msNow - lastCalls[fpsKey]
    if (fpsKey <= msWaited)
      CALLBACKS_LASTCALL[fpsKey] = msNow
      CALLBACKS[fpsKey].forEach(callbackWrapper, this)
  return

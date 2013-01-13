gamejs = require('../gamejs')

###
 * @fileoverview Playing sounds with the html5 audio tag. Audio files must be preloaded
 * with the usual `gamejs.preload()` function. Ogg, wav and webm supported.
 *
 * Sounds & Images are loaded relative to './'.
 ###

CACHE = {}

###
 * need to export preloading status for require
 * @ignore
 ###
_PRELOADING = false

###
 * @ignore
 ###
NUM_CHANNELS = 8

###
 * Sets the number of available channels for the mixer. The default value is 8.
 ###
exports.setNumChannels = (count) ->
  NUM_CHANNELS = parseInt(count, 10) || NUM_CHANNELS

exports.getNumChannels = () ->
  return NUM_CHANNELS

###
 * put all audios on page in cache
 * if same domain as current page, remove common href-prefix
 * @ignore
 ###
exports.init = () ->
  audios = Array.prototype.slice.call(document.getElementsByTagName("audio"), 0)
  addToCache(audios)
  return

###
 * Preload the audios into cache
 * @param {String[]} List of audio URIs to load
 * @returns {Function} which returns 0-1 for preload progress
 * @ignore
 ###
exports.preload = (audioUrls, showProgressOrImage) ->
  countTotal = 0
  countLoaded = 0

  incrementLoaded = () ->
    countLoaded++
    _PRELOADING = false if (countLoaded == countTotal)

  getProgress = () ->
    if countTotal > 0 then countLoaded / countTotal else 1

  successHandler = () ->
    addToCache(this)
    incrementLoaded()

  errorHandler = () ->
    incrementLoaded()
    throw new Error('Error loading ' + this.src)

  for key of audioUrls
    continue if (key.indexOf('wav') == -1 && key.indexOf('ogg') == -1 && key.indexOf('webm') == -1)

    countTotal++
    audio = new Audio()
    audio.addEventListener('canplay', successHandler, true)
    audio.addEventListener('error', errorHandler, true)
    audio.src = audioUrls[key]
    audio.gamejsKey = key
    audio.load()

  _PRELOADING = true if (countTotal > 0)

  return getProgress

### * @ignore ###
exports.isPreloading = () ->
  return _PRELOADING

###
 * @param {dom.ImgElement} audios the <audio> elements to put into cache
 * @ignore
 ###
addToCache = (audios) ->
  if (!(audios instanceof Array))
    audios = [audios]

  docLoc = document.location.href
  audios.forEach((audio) ->
    CACHE[audio.gamejsKey] = audio
  )
  return

###
 * Sounds can be played back.
 * @constructor
 * @param {String|dom.AudioElement} uriOrAudio the uri of <audio> dom element
 *                of the sound
 ###
exports.Sound = Sound = (uriOrAudio) ->
  cachedAudio
  if (typeof uriOrAudio == 'string')
    cachedAudio = CACHE[uriOrAudio]
  else
    cachedAudio = uriOrAudio
  if (!cachedAudio)
    ### TODO sync audio loading ###
    throw new Error('Missing "' + uriOrAudio + '", gamejs.preload() all audio files before loading')

  channels = []
  i = NUM_CHANNELS
  while (i-->0)
    audio = new Audio()
    audio.preload = "auto"
    audio.loop = false
    audio.src = cachedAudio.src
    channels.push(audio)

  ###
   * start the sound
   * @param {Boolean} loop whether the audio should loop for ever or not
   ###
  this.play = (myLoop) ->
    channels.some((audio) ->
      if (audio.ended || audio.paused)
        audio.loop = !!myLoop
        audio.play()
        return true
      return false
    )

  ###
   * Stop the sound.
   * This will stop the playback of this Sound on any active Channels.
   ###
  this.stop = () ->
    channels.forEach((audio) ->
      audio.stop()
    )

  ###
   * Set volume of this sound
   * @param {Number} value volume from 0 to 1
   ###
  this.setVolume = (value) ->
    channels.forEach((audio) ->
      audio.volume = value
    )

  ###
   * @returns {Number} the sound's volume from 0 to 1
   ###
  this.getVolume = () ->
    return channels[0].volume

  ###
   * @returns {Number} Duration of this sound in seconds
   ###
  this.getLength = () ->
    return channels[0].duration

  return this

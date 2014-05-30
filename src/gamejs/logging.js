
/**
 * @fileoverview Static methods for logging and setting the log level. All logging functions (`info()`, `debug()`, etc.) take
 * any number of arguments and will print them in one line.
 *
 */

var DEBUG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
var debugLevel = 2;
var gamejs = require('../gamejs');

/**
 * set logLevel as string or number
 *   * 0 = info
 *   * 1 = warn
 *   * 2 = error
 *   * 3 = fatal
 *
 * @example
 * gamejs.setLogLevel(0); // debug
 * gamejs.setLogLevel('error'); // equal to setLogLevel(2)
 */
exports.setLogLevel = function(logLevel) {
   if (typeof logLevel === 'string' && DEBUG_LEVELS.indexOf(logLevel)) {
      debugLevel = DEBUG_LEVELS.indexOf(logLevel);
   } else if (typeof logLevel === 'number') {
      debugLevel = logLevel;
   } else {
      throw new Error('invalid logLevel ', logLevel, ' Must be one of: ', DEBUG_LEVELS);
   }
   return debugLevel;
};

/**
 * Log a msg to the console if console is enable
 * @param {String} message,... the msg to log
 */
var log = exports.log = function() {

   if (gamejs.thread.inWorker === true) {
      gamejs.thread._logMessage.apply(null, arguments);
      return;
   }

   // IEFIX can't call apply on console
   var args = Array.prototype.slice.apply(arguments, [0]);
   args.unshift(Date.now());
   if (window.console !== undefined && console.log.apply) {
      console.log.apply(console, args);
   }
};
/**
 * @param {String} message,... to log
 */
exports.debug = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('debug')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message,... to log
 */
exports.info = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('info')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message,... to log
 */
exports.warn = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('warn')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message,... to log
 */
exports.error = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('error')) {
      log.apply(this, arguments);
   }
};
/**
 * @param {String} message to log
 */
exports.fatal = function() {
   if (debugLevel <= DEBUG_LEVELS.indexOf('fatal')) {
      log.apply(this, arguments);
   }
};

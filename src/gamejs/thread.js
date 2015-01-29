var gamejs = require('../gamejs');
var uri = require('./utils/uri');
var Callback = require('./utils/callback').Callback;

/**
 * @ignore
 */
var _EVENTS = exports._EVENTS = {
   RESULT: 1001,
   ALIVE: 1002,
   LOG: 1004
};

/**
 * @fileoverview
 *
 * The `gamejs.worker` module makes it more convinient to work with browser's WebWorkers by providing a way to run
 * CommonJs modules inside a Worker. GameJs also provides event facilities to communicate between the main code and Workers.
 *
 * See the `examples/workers` directory for a running example.
 *
 * In the main module, we create a worker which should use the "foo-worker" module as its main module:
 *
 *     var fooWorker = new Worker('./foo-worker');
 *     // Send a message to your worker.
 *     // The Message doesn't have to be a string but it
 *     // must be `JSON.stringify()`-able
 *     fooWorker.post("foobar");
 *
 * You can also recieve messages from the Worker:
 *
 *     // recieve events from the worker
 *     fooWorker.onEvent(function(event) {
 *         if(event.timestamp > ...)
 *      });
 *
 * And below is how the "foo-worker" module looke like. As usual, we need a
 * `gamejs.ready()` to get started and within that we bind an event handler
 * to recieve events from the main module:
 * 
 *     var gamejs = require('gamejs');
 *     gamejs.ready(function() {
 *         gamejs.event.onEvent(function(event) {
 *              var plaintext = fastCrack(event.password)
 *              ....
 *          });
 *     });
 *
 * Our event worker could do long-running calculations without blocking the main module. Once the worker
 * has calculated the result, it can be sent back to the main modules using `gamejs.thread.post()`:
 *
 *     gamejs.thread.post({
 *        info: "important message from worker",
 *        timestamp: 12232435234
 *      });
 *
 * The main module will in turn recieve an event posted from the worker in the function registered
 * to `fooWorker.onEvent()`, as seen above.
 *
 * The thread module is useful for expensive algorithms where the result does not have to available instantaneously
 * (e.g., path-finding) or for continous logic which can be
 * calculated seperately from the main module which necessarily has the rendering loop.
 * The main draw back of the `Worker` model is that
 * you can only communicate with them via text messages (typically JSON.stringify()ed messages).
 */

/**
 * true if this GameJs instance is being executed within a WebWorker
 * @type Boolean
 */
var inWorker = exports.inWorker = (this.importScripts !== undefined);

/**
 * executed in scope of worker
 * @ignore
 */
exports._ready = function() {
   self.onmessage = function(event) {
      gamejs.event._triggerCallbacks(event.data);
   };
   self.postMessage({
     type: _EVENTS.ALIVE
   });
};

/**
 * Send an event back to the main script.
 * @param {Object} data to be sent back to main script
 */
exports.post = function(data) {
  if (inWorker) {
    self.postMessage({
       type: _EVENTS.RESULT,
       data: data
    });
  } else {
    throw new Error('gamejs.postMessage only available in a thread/worker module');
  }
};

/**
 * Send message to main context for logging
 * @ignore
 **/
exports._logMessage = function() {
   var args = [];
   Array.prototype.forEach.call(arguments, function(a) {
     args.push(a);
   });
   self.postMessage({
      type: _EVENTS.LOG,
      arguments: args
   });
};


/**
  * executed in scope of worker before user's main module
  * @ignore
  */
var workerPrefix = function workerPrefix() {
   __scripts.forEach(function(script) {
      try {
         importScripts(script);
      } catch (e) {
         // can't help the worker
      }
   });
};

/**
 * Setup a worker which has `require()` defined
 * @ignore
 **/
var create = function(workerModuleId) {
   var moduleRoot = uri.resolve(document.location.href, window.require.getModuleRoot());
   var initialScripts = [];
   Array.prototype.slice.apply(document.getElementsByTagName('script'), [0]).forEach(function(script) {
      if (script.src) {
         initialScripts.push(script.src);
      }
   });

   var URL = window.URL || window.webkitURL;
   var prefixString = workerPrefix.toString();
   // don't be afraid...
   prefixString = prefixString.substring(prefixString.indexOf("{") + 1, prefixString.lastIndexOf("}"));
   var blob = new Blob([
      'var __scripts = ["' + initialScripts.join('","') + '"];',
      prefixString,
      ';self.require.setModuleRoot("' + moduleRoot + '");',
      'self.require.run("'+ workerModuleId +'");'
   ], {type: 'application\/javascript'});

   var blobURL = URL.createObjectURL(blob);
   return new Worker(blobURL);
};

/**
 * The `Worker` constructor takes only one argument: a module id. This module
 * will be executed inside the newly created Worker. It is effectively the
 * main module of the Worker.
 *
 * Inside a Worker, you can use `require()` to import other scripts or
 * GameJs modules.
 *
 * **Note:** A Worker does not have access to the browser's `document`. So
 * a lot of GameJs modules - e.g. any module related to drawing to the canvas -
 * do not work in the Worker.
 *
 * You can use `gamejs.math.*`, `gamejs.vectors.*`, and probably others
 * as well as any module you write yourself for this purpose.
 *
 * @param {String} moduleId The Worker's main module id. The main module will be executed in the worker
 */
exports.Worker = function(moduleId) {
   // FIXME id should be unchangeable
   /**
    * Unique id of this worker
    * @property {Number}
    */
   var id = this.id = guid(moduleId);
   var worker = create(moduleId);
   var deadQueue = [];
   var alive = false;
   var self  = this;
   var _CALLBACKS = [];
   var _ERROR_CALLBACKS = [];

   function triggerCallbacks(callbacks, event) {
      callbacks.forEach(function(c) {
         c.trigger(event);
      });
   }

   worker.onmessage = function(event) {
      if (event.data.type === _EVENTS.ALIVE) {
         // if worker says he is alive -> send him the event queue so far
         alive = true;
         deadQueue.forEach(function(data) {
            self.post(data);
         });
      } else if (event.data.type === _EVENTS.LOG) {
         gamejs.logging.log.apply(null, [id].concat(event.data.arguments));
      } else {
         triggerCallbacks(_CALLBACKS, event.data.data);
      }
   };
   worker.onerror = function(event) {
      gamejs.logging.error('Error in worker "' + id + '" line ' + event.lineno + ': ', event.message);
      triggerCallbacks(_ERROR_CALLBACKS, {
         data: event.data,
         worker: self,
         event: event
      });
   };

   this.onEvent = function(fn, scope) {
      _CALLBACKS.push(new Callback(fn, scope));
   };

   this.onError = function(fn, scope) {
      _ERROR_CALLBACKS.push(new Callback(fn, scope));
   };

   /**
    * Send a message to the worker
    *
    * @param {Object} data Payload object which gets sent to the Worker
    */
   this.post = function(data) {
      if (alive) {
         worker.postMessage(data);
      } else {
         deadQueue.push(data);
      }
   };
   return this;
};

/**
 * not a real GUID
 * @ignore
 */
function guid(moduleId) {
   var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   };
   return moduleId + '@' + (S4()+S4());
}

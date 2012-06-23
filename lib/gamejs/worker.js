var gamejs = require('gamejs');

/**
 * @fileoverview Workers are useful for background tasks. The most important feature of
 * Worker's is, that their execution does not block the browser's UI.
 *
 * If you have a long running loop in the normal browser context then the whole browser would
 * "lock up", not be responsive. If you run the same loop in a Worker, the browser's GUI
 * will still respond to user input.
 *
 * See the `examples/workers` directory for a running example.
 *
 * @example
 *  // create a worker in your application:
 *  var fooWorker = new Worker('./test');
 *  // send a message to your worker
 *  // this doesn't have to be a string but it must be stringify-able.
 *  fooWorker.post("foobar");
 *
 *  // instead of using `Worker.post` you could also send the message
 *  // via the normal gamejs.event queue as type `gamejs.event.WORKER`:
 *  gamejs.event.post({
 *    type: gamejs.event.WORKER,
 *    worker: fooWorker,
 *    data: "foobar"
 *  });
 *
 *  // the result of the worker will be accessible
 *  // via the normal gamejs.event queue:
 *  if (event.type === gamejs.event.WORKER_RESULT) {
 *     gamejs.log('Worker #' + event.worker.id + ' returned ' + event.data);
 *  }
 *
 *  // In the worker module, we can send results back to the main script
 *  //  by simply posting them to the gamejs event queue
 *  // as type `gamejs.event.WORKER_RESULT`:
 *  gamejs.event.post({
 *     type: gamejs.event.WORKER_RESULT,
 *     data: "zarzar"
 *  });
 *
 */

/**
 * true if this GameJs instance is being executed within a WebWorker
 * @type Boolean
 */
exports.inWorker = (this.importScripts !== undefined);

/**
 * executed in scope of worker after user's main module
 * @ignore
 */
exports._ready = function () {
   var gamejs = require('gamejs');
   self.onmessage = function(event) {
      gamejs.event.post(event.data)
   };
   self.postMessage({
      type: gamejs.event.WORKER_ALIVE
   });
};

/**
 * Send message to main context for logging
 * @ignore
 **/
exports._logMessage = function(arguments) {
   self.postMessage({
      type: gamejs.event.WORKER_LOGMESSAGE,
      arguments: Array.prototype.slice.apply(arguments)
   });
};

/**
 * Send result message to main context
 * @ignore
 */
exports._messageMain = function(event) {
   self.postMessage({
      type: gamejs.event.WORKER_RESULT,
      data: event.data
   });
};

/**
  * executed in scope of worker before user's main module
  * @ignore
  */
var workerPrefix = function workerPrefix() {
   __scripts.forEach(function(script) {
      try {
         importScripts(script)
      } catch (e) {
         // can't help the worker
      }
   });
};

/**
 * Setup a worker which has `reqire()` defined
 * @ignore
 **/
var create = function(workerModuleId) {
   // FIXME depends on 'index.html'
   var idx = document.location.href.indexOf('index.html');
   var docLoc = idx > -1 ? document.location.href.substr(0, idx) : document.location.href;
   var moduleRoot = docLoc + window.require.getModuleRoot();
   var initialScripts = [];
   Array.prototype.slice.apply(document.getElementsByTagName('script'), [0]).forEach(function(script) {
      if (script.src) {
         initialScripts.push(script.src);
      }
   });

   var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;
   var URL = window.URL || window.webkitURL;
   var bb = new BlobBuilder();
   var prefixString = workerPrefix.toString();
   // don't be afraid...
   prefixString = prefixString.substring(prefixString.indexOf("{") + 1, prefixString.lastIndexOf("}"));
   bb.append([
      'var __scripts = ["' + initialScripts.join('","') + '"];',
      prefixString,
      'self.require.setModuleRoot("' + moduleRoot + '");',
      'self.require.run("'+ workerModuleId +'");'
   ].join('\n\r'));

   var blobURL = URL.createObjectURL(bb.getBlob());
   return new Worker(blobURL);
};

/**
 * The `Worker` constructor takes only one argument: a module id. This module
 * will be executed inside the newly created Worker.
 *
 * Inside the worker, you can use `require()` to import other scripts or
 * GameJs modules.
 *
 * **Note:** A Worker does not have access to the DOM, not even to the `document`. So
 * a lot of GameJs modules make no sense in the Worker.
 *
 * But you can use `gamejs.time.*`, `gamejs.utils.*`, `gamejs.event.*` and probably others
 * as well as any module you write yourself.
 *
 * @param {String} moduleId The Worker's main module id. This module will be executed in the worker
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

   worker.onmessage = function(event) {
      if (event.data.type === gamejs.event.WORKER_ALIVE) {
         alive = true;
         deadQueue.forEach(function(data) {
            self.post(data);
         });
      } else if (event.data.type === gamejs.event.WORKER_LOGMESSAGE) {
         gamejs.log.apply(null, [id].concat(event.data.arguments));
      } else {
         gamejs.event.post({
            type: gamejs.event.WORKER_RESULT,
            data: event.data.data,
            worker: self,
            event: event,
         })
      }
   };
   worker.onerror = function(event) {
      gamejs.error('Error in worker "' + id + '" line ' + event.lineno + ': ', event.message)
      gamejs.event.post({
         type: gamejs.event.WORKER_ERROR,
         data: event.data,
         worker: self,
         event: event,
      })
   };

   /**
    * Send a message to the worker
    *
    * @param {Object} data a payload object which gets sent to the server
    */
   this.post = function(data) {
      if (alive) {
         worker.postMessage({
            type: gamejs.event.WORKER,
            data: data
         });
      } else {
         deadQueue.push(data);
      }
   };
   return this;
}

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
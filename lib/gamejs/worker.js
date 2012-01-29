var gamejs = require('gamejs');

var workers = {};

var onInit = function onInit() {
   scripts.forEach(function(script) {
      importScripts(script)
   });
}

exports._messageWorker = function(event) {
   workers[event.workerId].postMessage(event);
}

exports._messageMain = function(event) {
   self.postMessage({
      type: gamejs.event.WORKER_RESULT,
      data: event.data,
      inWorker: true
   });
}

exports.create = function(workerId, workerModuleId) {
   var idx = document.location.href.indexOf('index.html');
   var docLoc = idx > -1 ? document.location.href.substr(0, idx) : document.location.href;
   var moduleRoot = docLoc + window.require.getModuleRoot();
   var initialScripts = [];
   Array.prototype.splice.apply(document.getElementsByTagName('script'), [0]).forEach(function(script) {
      if (script.src) {
         initialScripts.push(script.src);
      }
   });


   // var moduleRoot = document.location.href + window.require.getModuleRoot();
   var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;
   var URL = window.URL || window.webkitURL;
   var bb = new BlobBuilder();
   var onInitFuncString = onInit.toString();
   // don't be afraid...
   onInitFuncString = onInitFuncString.substring(onInitFuncString.indexOf("{") + 1, onInitFuncString.lastIndexOf("}"));
   onMsgFuncString = onInitFuncString.substring(onInitFuncString.indexOf("{") + 1, onInitFuncString.lastIndexOf("}"));
   bb.append([
      'var scripts = ["' + initialScripts.join('","') + '"];',
      onInitFuncString,
      'self.require.setModuleRoot("' + moduleRoot + '");',
      'self.require.run("'+ workerModuleId +'");'
   ].join('\n\r'));

   var blobURL = URL.createObjectURL(bb.getBlob());
   var worker = new Worker(blobURL);
   worker.onmessage = function(event) {

      if (event.data.type === gamejs.event.WORKER_ALIVE) {
         gamejs.event.post(event.data);
      } else {
         gamejs.event.post({
            type: gamejs.event.WORKER_RESULT,
            data: event.data.data,
            workerId: workerId,
            event: event,
         })
      }
   };
   worker.onerror = function(event) {
      gamejs.error('Error in worker ', workerId, 'line', event.lineno, ': "', event.message, '"')
      gamejs.event.post({
         type: gamejs.event.WORKER_ERROR,
         data: event.data,
         workerId: workerId,
         event: event,
      })
   };
   setTimeout(function() {
      // need to wait shortly for worker to load
      worker.postMessage('wakeup');
   }, 2000);
   workers[workerId] = worker;
}

// stdlib
var {Application} = require('stick');
var response = require('ringo/jsgi/response');
var {mimeType} = require("ringo/mime");
var {Server} = require('ringo/httpserver');
var {join, list} = require('fs');
var log = require('ringo/logging').getLogger(module.id);

var app = exports.app = Application();
app.configure('notfound', 'error', 'mount', 'route');

var FS = {
   apps: '../examples',
};

// serve img, sound, json, etc
app.mount('/resources', function(req) {
   var parts = req.pathInfo.split('/');
   var appId = parts[0];
   var resourceType = parts[1];
   var resourcePath = parts.slice(2).join('/');
   var path = join(FS.apps, appId, resourceType, resourcePath);
   var resource = getResource(path);
   if (resource && resource.exists()) {
      return response.static(resource, mimeType(path, 'text/plain'));
   }
});

// gamejs-app's server application
list(module.resolve(FS.apps)).forEach(function(appId) {
   try {
      var mountPoint = '/server/' + appId;
      app.mount(mountPoint, require(appId));
      log.info('Mounted stick application ' + appId);
   } catch (e) {
      if (e.name != 'InternalError') {
         log.error(e);
      }
      return;
   }
}, this);

// html & js
app.mount('/', require('./actions'));

// start server if run as main script
if (require.main === module) {
   require("ringo/httpserver").main(module.id);
}

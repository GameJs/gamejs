// stdlib
var {Application} = require('stick');
var {Response} = require('ringo/webapp/response');
var {mimeType} = require("ringo/webapp/mime");
var {Server} = require('ringo/httpserver');
var {join, list} = require('fs');
var log = require('ringo/logging').getLogger(module.id);

var app = exports.app = Application();
app.configure('notfound', 'error', 'mount', 'route');

var FS = {
   apps: '../apps',
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
      return Response.static(resource, mimeType(path, 'text/plain'));
   }
});

// gamejs-app's server application
list(module.resolve(FS.apps)).forEach(function(appId) {
   try {
      var mountPoint = '/server/' + appId;
      var module = join(FS.apps, appId, 'server').toString();
      app.mount(mountPoint, require(module));
      log.info('mounted ', appId, ' @ ', mountPoint);
   } catch (e) {
      if (e.name != 'JavaException') {
         log.error(e);
      }
      return;
   }
}, this);

// html & js
app.mount('/', require('./actions'));

if (require.main === module) {
   require('stick/server').main(module.id);
}

// stdlib
var {Application} = require('stick');
var {Response} = require('ringo/webapp/response');
var {mimeType} = require("ringo/webapp/mime");
var {Server} = require('ringo/httpserver');
var {join, list} = require('fs');

var app = exports.app = Application();
app.configure('notfound', 'error', 'modulr/middleware', 'mount');

// images, data serving
app.mount('/resources', function(req) {
   var parts = req.pathInfo.split('/');
   var appId = parts[0];
   var resourceType = parts[1];
   var resourcePath = parts.slice(2).join('/');
   var path = join(module.resolve('../apps/'), appId, resourceType, resourcePath);
   var resource = getResource(path);
   if (resource && resource.exists()) {
      return Response.static(resource, mimeType(path, 'text/plain'));
   }
});

// mount the gamejs-apps server application if present
list(module.resolve('../apps/')).forEach(function(appId) {
   try {
      var mountPoint = '/server/' + appId;
      var module = 'gamejs/apps/' + appId + '/server';
      app.mount(mountPoint, require(module));
   } catch (e) {
      return;
   }
}, this);

app.mount('/', require('./actions'));

// serve wrapped js modules
app.modulr(module.resolve('../lib/'), '/lib/');

if (require.main === module) {
   require('stick/server').main(module.id);
}

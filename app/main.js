// stdlib
var {Application} = require('stick');
var {Response} = require('ringo/webapp/response');
var {mimeType} = require("ringo/webapp/mime");
var {Server} = require('ringo/httpserver');
var {join} = require('fs');

var app = Application();
app.configure('responselog', 'notfound', 'modulr/middleware', 'mount', 'static');

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

app.mount('/', require('./actions'));

// serve wrapped js modules
app.modulr(module.resolve('../lib/'), '/lib/');

var server = server || new Server({port: '8080', app: app});
server.start();

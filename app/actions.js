// stdlib
var {Response} = require('ringo/webapp/response');
var {join, list} = require('fs');
var {mimeType} = require("ringo/webapp/mime");
var config = require('./config');

exports.index = function(req) {
   return Response.skin('skins/index.html', {
      apps: list('../apps/'),
   })
};

exports.app = function(req, appName) {
   return Response.skin('skins/app.html', {
      appName: appName,
      resourceBaseHref: config.getResourceBaseHref(appName),
      mainScriptHref: config.getMainScriptHref(appName),
      wsFallbackBaseHref:config.getResourceBaseHref('util-websocket-fallback'),
   });
}

exports.resources = function(req, appName, resourceType, resourcePath) {
   // basically ringo/middleware/static but every app can
   // have different resourceBase and we grab resourceInfo
   // from various path elements.
   var basePath = '../apps/';
   var path = join(basePath, appName, resourceType, resourcePath);
   var resource = getResource(path);
   if (resource && resource.exists()) {
      return Response.static(resource, mimeType(path, 'text/plain'));
   }
}

// stdlib
var {Response} = require('ringo/webapp/response');
var {join} = require('fs');
var {mimeType} = require("ringo/webapp/mime");
var config = require('./config');

exports.index = function(req, appName) {
   if (!appName) {
      return new Response('missing app name');
   }
   return Response.skin('skins/base.html', {
      resourceBaseHref: config.getResourceBaseHref(appName),
      mainScriptHref: config.getMainScriptHref(appName),
      wsFallbackBaseHref:config.getResourceBaseHref('websocketFallback'),
   });
};

exports.resources = function(req, appName, resourceType, resourcePath) {
   // basically ringo/middleware/static but every app can
   // have different resourceBase and we grab resourceInfo
   // from various path elements.
   var basePath = config.apps[appName].resourceBase;
   var path = join(basePath, resourceType, resourcePath);
   var resource = getResource(path);
   if (resource && resource.exists()) {
      return Response.static(resource, mimeType(path, 'text/plain'));
   }
}

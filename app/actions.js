// stdlib
var {Response} = require('ringo/webapp/response');
var {exists, join, list} = require('fs');
var {mimeType} = require("ringo/webapp/mime");
var strings = require('ringo/utils/strings');

var config = require('./config');
exports.index = function(req) {
   return Response.skin('skins/index.html', {
      // hide util-* apps
      apps: list(join(module.directory, '../apps/')).filter(function(path) { return !strings.startsWith(path, 'util'); }),
   })
};

exports.app = function(req, appId) {
   var appSpecific = join(module.directory, '../apps/', appId, 'app.html');
   return Response.skin(exists(appSpecific) ? appSpecific : 'skins/app.html', {
      appId: appId,
      websocketHost: 'localhost:8080',
   });
}

exports.resources = function(req, appId, resourceType, resourcePath) {
   // basically ringo/middleware/static but every app can
   // have different resourceBase and we grab resourceInfo
   // from various path elements.
   var basePath = '../apps/';
   var path = join(basePath, appId, resourceType, resourcePath);
   var resource = getResource(path);
   if (resource && resource.exists()) {
      return Response.static(resource, mimeType(path, 'text/plain'));
   }
}

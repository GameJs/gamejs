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

exports.app = function(req, appId) {
   return Response.skin('skins/app.html', {
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

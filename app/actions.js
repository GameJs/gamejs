// stdlib
var {Response} = require('ringo/webapp/response');
var {join} = require('fs');

exports.index = function(req, appName) {
   if (!appName) {
      return new Response('missing app name');
   }
   return Response.skin('skins/base.html', {
      appModule: appName,
      assetBaseUrl: '/' + appName + '/',
   });
};

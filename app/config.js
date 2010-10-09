// Demo webapp showing use of ringo-modulr middleware.
// Run with ringo-web.

var static = require('ringo/middleware/static');
var modulr = require('modulr/middleware');
var {join} = require('fs');
var {Response} = require('ringo/webapp/response');

// served apps by this gamejs server
var apps = exports.apps = {
   /*
   yourAppName: {
      scriptBase: '/main.js/directory/',
      resourceBase: 'resource/directory/
   }
    */
};

// add examples to app by default
['draw', 'sprite', 'extra', 'iso'].forEach(function(appName) {
   apps[appName] = {
      name: appName,
      resourceBase: join(module.directory, '../examples/', appName),
      scriptBase: join(module.directory, '../examples/', appName),
   };
}, this);


// put the href helpers here so they are close to the urls
exports.getResourceBaseHref = function(appName) {
   return '/' + appName + '/';
};
exports.getMainScriptHref = function(appName) {
   return ['/lib/app', appName, 'main.js'].join('/');
}

// url setup
// and a matcher for serving resources from the apps resource directories.
exports.urls = [
   // dashboard
   ['/', './actions', 'index'],
   // app wrapper html
   [ '/([^/]+)/', './actions', 'app'],
   // static files: appName/resourceType/resourcePath/
   [ '/([^/]+)/(?:/*)(images|javascript|flash)/(?:/*)(.*)', './actions', 'resources'],
];

// gamejs server needs to serve some js files and flash statically to have websocket 
// support in firefox. this websocketFallback app does that serving.
apps.websocketFallback = {
   name: '[[websocket internal]]',
   resourceBase: join(module.directory, 'static/web-socket-js'),
};

// clientside javascript library directory. holds all gamejs modules as well as
// all apps.
exports.middleware = [
    modulr.middleware(join(module.directory, "../lib-client/"), "/lib/"),
];

// ringo stuff
exports.app = require('ringo/webapp').handleRequest;
exports.charset = 'UTF-8';
exports.contentType = 'text/html';

// experimental websocket networking
exports.extensions = ["websocket-extension"];

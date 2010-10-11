// Demo webapp showing use of ringo-modulr middleware.
// Run with ringo-web.

var static = require('ringo/middleware/static');
var modulr = require('modulr/middleware');
var {join} = require('fs');
var {Response} = require('ringo/webapp/response');

// href helpers
exports.getResourceBaseHref = function(appName) {
   return '/' + appName + '/';
};
exports.getMainScriptHref = function(appName) {
   return ['/lib/gamejs/apps', appName, 'main.js'].join('/');
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
exports.extensions = ['./websocket'];

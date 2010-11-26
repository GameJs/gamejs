// Demo webapp showing use of ringo-modulr middleware.
// Run with ringo-web.

var modulr = require('modulr/middleware');
var {join} = require('fs');
var {Response} = require('ringo/webapp/response');
var gserver = require('gamejs/network/server');

// games with network support must defined a network controller here.
// the websocket will relay events for this game to the networkcontroller
// and use the game class to instantiate new games.
exports.networkControllers = {
   'example-network': 
      new gserver.NetworkController(
         'example-network',
         require('gamejs/network/server').Game
      )
};

// url setup
// and a matcher for serving resources from the apps resource directories.
exports.urls = [
   // dashboard
   ['/', './actions', 'index'],
   // app wrapper html
   [ '/([^/]+)/', './actions', 'app'],
   // static files: appId/resourceType/resourcePath/
   [ '/([^/]+)/(?:/*)(images|json|javascript|flash)/(?:/*)(.*)', './actions', 'resources'],
];

// clientside javascript library directory. holds all gamejs modules as well as
// all apps.
exports.middleware = [
    modulr.middleware(join(module.directory, "../lib/"), "/lib/"),
];

// ringo stuff
exports.app = require('ringo/webapp').handleRequest;
exports.charset = 'UTF-8';
exports.contentType = 'text/html';

exports.macros = [
    require('./macros'),
    require('ringo/skin/macros'),
    require('ringo/skin/filters')
];

// experimental websocket networking
exports.extensions = ['./websocket'];

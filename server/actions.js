// stdlib
var {Application} = require("stick");
var {Response} = require('ringo/webapp/response');
var {exists, join, list} = require('fs');
var {mimeType} = require("ringo/webapp/mime");
var strings = require('ringo/utils/strings');
var {Collector} = require('modulr/collector');

var app = exports.app = Application();
app.configure("params", "render", "route");
app.render.helpers(require("./macros"), "ringo/skin/macros", "ringo/skin/filters");

// file system path constants
var FS = {
   apps: '../examples',
   lib: './packages/gamejs/lib',
};

// dashboard
app.get('/', function(req) {
   return app.render(module.resolve('./skins/index.html'), {
      apps: list(module.resolve(FS.apps)),
   })
});

// app site
app.get('/:appId/', function(req, appId) {
   var customSkin = module.resolve(join(FS.apps, appId, 'index.html'));
   print (customSkin);
   return app.render( exists(customSkin) ? customSkin.toString() : module.resolve('./skins/app.html'), {
      appId: appId,
   });
});

// wrapped js modules
app.get('/lib/:appId/main.js', function(req, appId) {
   var base = getRepository(FS.lib);
   var coll = new Collector(base);
   // FIXME *cough* apps path relative to FS.lib
   coll.add('../../../../examples/' + appId + '/main');
   return {
      status: 200,
      headers: {"Content-Type": "text/javascript"},
      body: coll
   };
});

// stdlib
var {Application} = require("stick");
var {Response} = require('ringo/webapp/response');
var {exists, join, list, canonical} = require('fs');
var {mimeType} = require("ringo/webapp/mime");
var strings = require('ringo/utils/strings');
var {Collector} = require('modulr/collector');

var app = exports.app = Application();
app.configure("params", "render", "route");

app.render.helpers(require("./macros"), "ringo/skin/macros", "ringo/skin/filters");

// dashboard
app.get('/', function(req) {
   return app.render(module.resolve('./skins/index.html'), {
      apps: list(module.resolve('../apps/')),
   })
});

// app site
app.get('/:appId/', function(req, appId) {
   var specificSkin = join(module.resolve('../apps/'), appId, 'index.html');
   var genericSkin = module.resolve('./skins/app.html');
   return app.render(exists(specificSkin) ? specificSkin : genericSkin, {
      appId: appId,
   });
});

// wrapped js modules
app.get('/lib/:appId/main.js', function(req, appId) {
   var root = canonical(module.resolve('../lib'));
   var appFile = join('../apps', appId, 'main.js');
   var base = getRepository(root);
   var coll = new Collector(base);
   coll.add(appFile);
   return {
      status: 200,
      headers: {"Content-Type": "text/javascript"},
      body: coll
   };
});

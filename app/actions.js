// stdlib
var {Application} = require("stick");
var {Response} = require('ringo/webapp/response');
var {exists, join, list} = require('fs');
var {mimeType} = require("ringo/webapp/mime");
var strings = require('ringo/utils/strings');

var app = exports.app = Application();
app.configure("params", "render", "route");

//app.render.base(module.resolve("skins"));
app.render.helpers(require("./macros"), "ringo/skin/macros", "ringo/skin/filters");

// dashboard
app.get('/', function(req) {
   return app.render(module.resolve('./skins/index.html'), {
      // hide util-* apps
      apps: list(module.resolve('../apps/')).
               filter(function(path) {
                  return !strings.startsWith(path, 'util');
               }),
   })
});

app.get('/:appId/', function(req, appId) {
   var specificSkin = join(module.resolve('../apps/'), appId, 'app.html');
   var genericSkin = module.resolve('./skins/app.html');
   return app.render(exists(specificSkin) ? specificSkin : genericSkin, {
      appId: appId,
      websocketHost: 'localhost:8080',
   });
});

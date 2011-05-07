// stdlib
var {Application} = require('stick');
var {exists, join, list} = require('fs');
var {mimeType} = require("ringo/mime");
var strings = require('ringo/utils/strings');
var objects = require('ringo/utils/objects');
var {Collector} = require('ringo-modulr');
var mustache = require('ringo/mustache');

function render(template, data) {
   var context = objects.merge({
      resourceHref: function() {
         return ('../resources/' + data.appId + '/').replace(/\/+/g, '/');
      },
      ajaxHref: function() {
         return ['../server/' + data.appId + '/'].join('/').replace(/\/+/g, '/');
      },
      rand: function() {
         return [Math.random() * Date.now(), Math.random() * Date.now()].join('.');
      },
      pathToMain: function() {
         return "../lib/" + data.appId;
      }
   }, data);
   return {
      status: 200,
      headers: {'Content-Type': 'text/html'},
      body: [mustache.to_html(template.content, context)]
   };
};

var app = exports.app = Application();
app.configure('params', 'route');

// file system path constants
var FS = {
   apps: '../examples',
   lib: './packages/gamejs/lib',
};

// dashboard
app.get('/', function(req) {
   var data = {
      apps: list(module.resolve(FS.apps))
   };
   return render(getResource('./templates/index.html'), data);
});

// app site
app.get('/:appId/', function(req, appId) {
   var customSkin = module.resolve(join(FS.apps, appId, 'index.html'));
   var skinPath = exists(customSkin) ? getResource(customSkin) :
                     getResource('./templates/app.html');
   return render(skinPath, {appId: appId});
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

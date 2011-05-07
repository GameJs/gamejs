var sys = require('system');
var {get} = require('ringo/httpclient');
var {join, copyTree, write, copy, exists, makeDirectory} = require('fs');
var objects = require('ringo/utils/objects');
var mustache = require('ringo/mustache');

function render(path, data) {
   var context = objects.merge({
      resourceHref: function() {
         return './';
      },
      ajaxHref: function() {
         return './json/';
      },
      rand: function() {
         return [Math.random() * Date.now(), Math.random() * Date.now()].join('.');
      },
      pathToMain: function() {
         return "./javascript/main.js";
      }
   }, data);
   var template = getResource(path).content;
   return mustache.to_html(template, context);
};

var myself = sys.args.shift();
var appName = sys.args[0];
var destinationDirectory = sys.args[1];
// FIXME throw error if gamejs server not running
var GAMEJS_SERVER = 'http://localhost:8080';

if (!appName || !destinationDirectory) {
   print ('Usage: ringo ' + myself + ' appName destinationDirectory');
   throw new Error('missing appName or destinationDirectory');
}

// path & urls
var appDirectory = join(module.resolve('../examples'), appName);
var appJsUrl = GAMEJS_SERVER + '/lib/' + appName + '/main.js';

// copy resources
['images', 'sounds', 'json'].forEach(function(resDir) {
   var fullResPath = join(appDirectory, resDir);
   if (exists(fullResPath)) {
      copyTree(fullResPath, join(destinationDirectory, resDir));
   }
}, this);

// render index.html
var appSpecific = join(appDirectory, 'index.html');
var template = exists(appSpecific) ? appSpecific : module.resolve('templates/app.html');
var indexHtml = render(template, objects.merge({
   appId: appName,
}));
write(join(destinationDirectory, 'index.html'), indexHtml);

// download & copy main.js
var response = get(appJsUrl);
var jsDir = join(destinationDirectory, 'javascript');
if (!exists(jsDir)) {
   makeDirectory(jsDir);
}
write(join(jsDir, 'main.js'), response.content);

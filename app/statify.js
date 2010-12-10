var sys = require('system');
var {get} = require('ringo/httpclient');
var {join, copyTree, write, copy, exists, makeDirectory} = require('fs');
var {render} = require('ringo/skin');

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
var appDirectory = join(module.directory, '../',  'apps', appName);
var appJsUrl = GAMEJS_SERVER + '/lib/gamejs/apps/' + appName + '/main.js';

// copy resources
['images', 'sounds', 'json'].forEach(function(resDir) {
   var fullResPath = join(appDirectory, resDir);
   if (exists(fullResPath)) {
      copyTree(fullResPath, join(destinationDirectory, resDir));
   }
}, this);

// render index.html
var appSpecific = join(appDirectory, 'app.html');
var indexHtml = render(exists(appSpecific) ? appSpecific : 'skins/app.html', {
   appName: appName,
   statifier: true,
});
write(join(destinationDirectory, 'index.html'), indexHtml);

// download & copy main.js
var response = get(appJsUrl);
var jsDir = join(destinationDirectory, 'javascript');
if (!exists(jsDir)) {
   makeDirectory(jsDir);
}
write(join(jsDir, 'main.js'), response.content);

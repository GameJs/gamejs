var sys = require('system');
var {get} = require('ringo/httpclient');
var {join, copyTree, write, copy, exists, makeDirectory} = require('fs');


var myself = sys.args.shift();
var appName = sys.args[0];
var destinationDirectory = sys.args[1];
var GAMEJS_SERVER = 'http://localhost:8080';

if (!appName || !destinationDirectory) {
   print ('Usage: ringo ' + myself + ' appName destinationDirectory');
   throw new Error('missing appName or destinationDirectory');
}

// path & urls
var appDirectory = join(module.directory, '../',  'apps', appName);
var appJsUrl = GAMEJS_SERVER + '/lib/gamejs/apps/' + appName + '/main.js';
var htmlPath = join(module.directory, 'index.html');

// copy resources

['images', 'sounds'].forEach(function(resDir) {
   var fullResPath = join(appDirectory, resDir);
   if (exists(fullResPath)) {
      copyTree(fullResPath, join(destinationDirectory, resDir));
   }
}, this);

// copy index.html
copy(htmlPath, join(destinationDirectory, 'index.html'));

// download & copy main.js
var response = get(appJsUrl);
makeDirectory(join(destinationDirectory, 'javascript'));
write(join(destinationDirectory, 'javascript', 'main.js'), response.content);

print ('Statified ' + appName + ' to ' + destinationDirectory);

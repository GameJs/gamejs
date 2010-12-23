// this file will be executed by the GameJs server!
var {Application} = require('stick');
var {jsonResponse} = require('stick/helpers');

// create & export a stick application
// for more info on stick see http://github.com/hns/stick
var app = exports.app = Application();
app.configure('params', 'notfound', 'error', 'route');

// route url /foobar to this function
app.get('/foobar', function() {
   // send an object
   return jsonResponse({"text": "Hello World!"});
});

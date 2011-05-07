/**
 * This server application responds with {text: 'Hello World'} if 'foobar'
 * is loaded.
 *
 * This file will be executed by the GameJs server! See main.js for the
 * client-side part.
 */
var {Application} = require('stick');
var response = require('ringo/jsgi/response');

// create & export a stick application
// for more info on stick see http://github.com/hns/stick
var app = exports.app = Application();
app.configure('params', 'notfound', 'error', 'route');

// route url /foobar to this function
app.get('/foobar', function() {
   // send an object
   return response.json({"text": "Hello World!"});
});

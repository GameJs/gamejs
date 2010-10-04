// Demo webapp showing use of ringo-modulr middleware.
// Run with ringo-web.

var static = require('ringo/middleware/static');
var modulr = require('modulr/middleware');
var {join} = require('fs');
var {Response} = require('ringo/webapp/response');

exports.urls = [
    [ '/', './actions'],
];

exports.middleware = [
    // mount modulr middleware on website root.
    // this will map URL /program.js to modulrized file ../example/program.js
    modulr.middleware(join(module.directory, "../lib-client/"), "/scripts/"),
    static.middleware(join(module.directory, '../examples/'))
];

print (join(module.directory, '../examples/'));
exports.app = require('ringo/webapp').handleRequest;
exports.charset = 'UTF-8';
exports.contentType = 'text/html';

exports.extensions = ["websocket-extension"];

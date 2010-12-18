/**
 * @fileoverview Make synchronous http requests to your game's serverside component.
 *
 * If you have a `server` module in your app that exports a stick web application
 * then that app is started by GameJs. You can send & load objects from the
 * server-side with the  `gamejs.http.load(url)` and `gamejs.http.save(url, object)` functions.
 *
 * You will need stick! install it with `ringo-admin`:
 *
 *    ringo-admin install ringo/stick
 *
 * @see http://ringojs.org/api/stick/stick/
 *
 * @example
 *      // on serverside in `server.js`:
 *      var {Application} = require('stick');
 *      var {jsonResponse} = require('stick/helpers');
 *
 *      // create & export a stick application
 *      var app = exports.app = Application();
 *      app.configure('params', 'notfound', 'error', 'route');
 *
 *      // route url /foobar to this function
 *      // see stick docu for more info on how to route.
 *      app.get('/foobar', function() {
 *          return jsonResponse({"hello": "world"});
 *      });
 *
 *      // on clientside:
 *      console.log(gamejs.http.load("/foobar"))
 *      // outputs: {"hello": "world"}
 *
 * more on how to write web applications with stick:
 *  * http://ringojs.org/api/stick/stick/
 *  * http://github.com/hns/stick
 */

/**
 * Response object returned by http functions `get` and `post`. This
 * class is not instantiable.
 *
 * @param{String} responseText
 * @param {String} responseXML
 * @param {Number} status
 * @param {String} statusText
 */
exports.Response = function() {
   /**
    * @param {String} header;
    */
   this.getResponseHeader = function(header)  {
   };
   throw new Error('response class not instantiable');
};

/*
 * Make http request to server-side
 * @param {String} method http method
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @return {Response} response
 */
var ajax = exports.ajax = function(method, url, data, type) {
   data = data || null;
   var response = new XMLHttpRequest();
   response.open(method, url, false);
   if (type) {
      response.setRequestHeader("Accept", type );
   }
   if (data instanceof Object) {
      data = JSON.stringify(data);
      response.setRequestHeader('Content-Type', 'application/json');
   }
   response.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   response.send(data);
   return response;
};

/**
 * Make http GET request to server-side
 * @param {String} url
 */
var get = exports.get = function(url) {
   return ajax('GET', url);
};

/**
 * Make http POST request to server-side
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @returns {Response}
 */
var post = exports.post = function(url, data, type) {
   return ajax('POST', url, data, type);
};

function stringify(response) {
   // we control origin
   return eval('(' + response.responseText + ')');
};

/**
 * Load an object from the server-side.
 * @param {String} url
 * @return {Object} the object loaded from the server
 */
exports.load = function(url) {
   return stringify(get($g.ajaxBaseHref + url));
};

/**
 * Send an object to a server-side function.
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @returns {Object} the response object
 */
exports.save = function(url, data, type) {
   return stringify(post($g.ajaxBaseHref + url, {payload: data}, type));
};

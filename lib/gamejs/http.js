/**
 * @fileoverview Make synchronous http requests.
 *
 * All methods return a `Response` instance.
 *
 * @example
 *      var response = get('http://example.com');
 *      if (response.status === 200) {
 *         console.log(response.responseText);
 *      } else {
 *         console.log('error ' + response.statusText);
 *      }
 */

/**
 * Response object returned by all http functions. This
 * class is not instantiable.
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

/**
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
 * @param {String} url
 */
var get = exports.get = function(url) {
   return ajax('GET', url);
};

/**
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
 * url is relative to this app's gamejs server side. answer interpreted
 * as json.
 * @param {String} url
 */
exports.load = function(url) {
   return stringify(get($g.ajaxBaseHref + url));
};

/**
 * url is relative to this app's gamejs server side. answer interpreted
 * as json.
 * @param {String} url
 * @param {String|Object} data
 * @param {String|Object} type "Accept" header value
 * @returns {Response}
 */
exports.save = function(url, data, type) {
   return stringify(post($g.ajaxBaseHref + url, {payload: data}, type));
};

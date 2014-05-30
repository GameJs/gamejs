/**
 * @fileoverview
 * A* path finding algorithm
 *
 * Use the `findRoute(map, from, to, [timeout])` function to get the linked list
 * leading `from` a point `to` another on the given `map`.
 *
 * The map must implement the interface `gamejs.pathfinding.Map`. This
 * class already holds an example implementation for debugging use.
 *
 * Optionally, the search is cancelled after `timeout` in millseconds.
 *
 * If there is no route `null` is returned.
 *
 * @see http://en.wikipedia.org/wiki/A*_search_algorithm
 * @see http://eloquentjavascript.net/chapter7.html
 */
var BinaryHeap = require('./math/binaryheap').BinaryHeap;

/**
 * helper function for A*
 */
function ReachedList(hashFn) {
   var list = {};

   this.store = function(point, route) {
      list[hashFn(point)] = route;
      return;
   };

   this.find = function(point) {
      return list[hashFn(point)];
   };
   return this;
}


/** A* search function.
 *
 * This function expects a `Map` implementation and the origin and destination
 * points given. If there is a path between the two it will return the optimal
 * path as a linked list. If there is no path it will return null.
 *
 * The linked list is in reverse order: the first item is the destination and
 * the path to the origin follows.
 *
 * @param {Map} map map instance, must follow interface defined in {Map}
 * @param {Array} origin
 * @param {Array} destination
 * @param {Number} timeout milliseconds after which search should be canceled
 * @returns {Object} the linked list leading from `to` to `from` (sic!).
 **/
exports.findRoute = function(map, from, to, timeout) {
   var open = new BinaryHeap(routeScore);
   var hashFn = typeof map.hash === 'function' ? map.hash : defaultHash;
   var reached = new ReachedList(hashFn);

   function routeScore(route) {
      if (route.score === undefined) {
         route.score = map.estimatedDistance(route.point, to) + route.length;
      }
      return route.score;
   }
   function addOpenRoute(route) {
      open.push(route);
      reached.store(route.point, route);
   }

   function processNewPoints(direction) {
      var known = reached.find(direction);
      var newLength = route.length + map.actualDistance(route.point, direction);
      if (!known || known.length > newLength){
         if (known) {
            open.remove(known);
         }
         addOpenRoute({
            point: direction,
            from: route,
            length: newLength
         });
      }
   }
   var startMs = Date.now();
   var route = null;
   addOpenRoute({
      point: from,
      from: null,
      length: 0
   });
   var equalsFn = typeof map.equals === 'function' ? map.equals : defaultEquals;
   while (open.size() > 0 && (!timeout || Date.now() - startMs < timeout)) {
      route = open.pop();
      if (equalsFn(to, route.point)) {
         return route;
      }
      map.adjacent(route.point).forEach(processNewPoints);
   } // end while
   return null;
};

var defaultEquals = function(a, b) {
   return a[0] === b[0] && a[1] === b[1];
};

var defaultHash = function(a) {
   return a[0] + '-' + a[1];
};

/**
 * This is the interface for a Map that can be passed to the `findRoute()`
 * function. `Map` is not instantiable - see the unit tests for an example
 * implementation of Map.
 */
var Map = exports.Map = function() {
   throw new Error('not instantiable, this is an interface');
};

/**
 * @param {Array} origin
 * @returns {Array} list of points accessible from given Point
 */
Map.prototype.adjacent = function(origin) {
};

/**
 * @param {Object} a one of the points ot test for equality
 * @param {Object} b ... the other point
 * @returns Wheter the two points are equal.
 */
Map.prototype.equals = defaultEquals;

/**
 * @param {Object} a point
 * @returns {String} hash for the point
 */
Map.prototype.hash = defaultHash;

/**
 * Estimated lower bound distance between two points.
 * @param {Object} pointA
 * @param {Object} pointB
 * @returns {Number} the estimated distance between two points
 */
Map.prototype.estimatedDistance = function(pointA, pointB) {
   return 1;
};

/**
 * Actual distance between two points.
 * @param {Object} pointA
 * @param {Object} pointB
 * @returns {Number} the actual distance between two points
 */
Map.prototype.actualDistance = function(pointA, pointB) {
   return 1;
};

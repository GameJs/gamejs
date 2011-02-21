/**
 * @fileoverview
 * AStar Path finding algorithm
 *
 * Use the `findRoute(map, from, to, [timeout])` function to get the linked list
 * leading `from` a point `to` another on the given `map`.
 *
 * The map interface is seen in `Map`.
 *
 * The resulting point list includes the two points `from` and `to` and in
 * between all points leading from `to` to `from` (sic! optimization).
 *
 * Example result:
 *     ({
 *         point: [
 *             3,
 *             3
 *         ],
 *         from: {
 *             point: [
 *                 2,
 *                 2
 *             ],
 *             from: {
 *                 point: [
 *                     1,
 *                     1
 *                 ],
 *                 from: {
 *                     point: [
 *                         0,
 *                         0
 *                     ],
 *                     from: null,
 *                     length: 0
 *                 },
 *                 length: 291,
 *                 score: 573
 *             },
 *             length: 524,
 *             score: 665
 *         },
 *         length: 729,
 *         score: 729
 *     })
 *
 * Optionally, the search is canceld after `timeout` in millseconds.
 *
 * If there is no route `null` is returned.
 *
 * Points are given as an Array [x, y].
 *
 * @see http://eloquentjavascript.net/chapter7.html
 */
var BinaryHeap = require('gamejs/utils/binaryheap').BinaryHeap;

/**
 * helper function for A*
 */
function ReachedList() {
   var list = {};

   this.store = function(point, route) {
      list[hash(point)] = route;
      return;
   };

   this.find = function(point) {
      return list[hash(point)];
   };
   return this;
};


/** A* search function.
 *
 * This function expects a `Map` implementation and the origin and destination
 * `Point`s. If there is a path between the two it will return the optimal
 * path as a linked list. If there is no path it will return null.
 *
 * The linked list is in reverse order: the first item is the destination and
 * the path to the origin follows.
 *
 * @param {Map} map map instance, must follow interface defined in {Map}
 * @param {Point} origin
 * @param {Point} destination
 * @param {Number} timeout milliseconds after which search should be canceled
 * @param {Object} the linked list leading from `to` to `from` (sic!).
 **/
exports.findRoute = function(map, from, to, timeout) {
   var open = new BinaryHeap(routeScore);
   var reached = new ReachedList();

   function routeScore(route) {
      if (route.score == undefined) {
         route.score = map.estimatedDistance(route.point, to) + route.length;
      }
      return route.score;
   }
   function addOpenRoute(route) {
      open.push(route);
      reached.store(route.point, route);
   }
   addOpenRoute({point: from,
                from: null,
                length: 0});

   var startMs = Date.now();
   while (open.size() > 0 && (!timeout || Date.now() - startMs < timeout)) {
      var route = open.pop();
      if (equals(to, route.point)) {
         return route;
      }
      map.adjacent(route.point).forEach(function(direction) {
         var known = reached.find(direction);
         var newLength = route.length +
                         map.actualDistance(route.point, direction);
         if (!known || known.length > newLength){
            if (known) {
               open.remove(known);
            }
            addOpenRoute({point: direction,
                          from: route,
                           length: newLength});
         }
      });
   } // end while
   return null;
};

/**
 * Unique hash for the point
 * @param {Array} p point
 * @returns {String}
 */
function hash(p) {
  return p[0] + "-" + p[1];
};

/**
 * Are two points equal?
 * @param {Array} a point
 * @param {Array} b point
 * @returns {Boolean}
 */
function equals(a, b) {
   return a[0] === b[0] && a[1] === b[1];
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
 * @returns {Array} list of `Point`s accessible from given Point
 */
Map.prototype.adjacent = function(origin) {
};

/**
 * Estimated lower bound distance between two given points.
 * @param {Array} pointA
 * @param {Array} pointB
 * @returns {Number} the estimated distance between two points
 */
Map.prototype.estimatedDistance = function(pointA, pointB) {
};

/**
 * Actual distance between the two given points.
 * @param {Array} pointA
 * @param {Array} pointB
 * @returns {Number} the actual distance between two points
 */
Map.prototype.actualDistance = function(pointA, pointB) {
}

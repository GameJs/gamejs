/**
 * AStar code from
 * http://eloquentjavascript.net/chapter7.html
 * http://eloquentjavascript.net/appendix2.html
 *
 * licensed by http://creativecommons.org/licenses/by/3.0/
 */
var BinaryHeap = require('gamejs/astar/binaryheap').BinaryHeap;

function ReachedList() {
   var list = {};
   
   this.store = function(point, route) {
      list[point.hash()] = route;
      return;
   };
   
   this.find = function(point) {
      return list[point.hash()];
   };
   return this;
};


/** actual a*
 * @param {Object} map map instance, must bollow interface defined in {gamejs.astar.map.Map}
 * @param {Point} from origin point 
 * @param {Point} to destination point
 **/
exports.findRoute = function(map, from, to) {
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

   while (open.size() > 0) {
      var route = open.pop();
      if (typeof route.point.equals === 'function' && route.point.equals(to)) {
         return route;
      }
      map.adjacent(route.point).forEach(function(direction) {
         var known = reached.find(direction);
         var newLength = route.length + 
                         map.weightedDistance(route.point, direction);
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

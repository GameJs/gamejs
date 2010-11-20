var assert = require('assert');
var astar = require('gamejs/astar');
var {Map, point} = require('gamejs/astar/map');


var ROUTE_A ={point:{x:19, y:19}, from:{point:{x:19, y:18}, from:{point:{x:19, y:17}, from:{point:{x:18, y:16}, from:{point:{x:18, y:15}, from:{point:{x:17, y:14}, from:{point:{x:16, y:13}, from:{point:{x:15, y:12}, from:{point:{x:14, y:11}, from:{point:{x:13, y:10}, from:{point:{x:12, y:9}, from:{point:{x:11, y:8}, from:{point:{x:10, y:7}, from:{point:{x:9, y:7}, from:{point:{x:8, y:6}, from:{point:{x:7, y:5}, from:{point:{x:6, y:4}, from:{point:{x:5, y:3}, from:{point:{x:4, y:2}, from:{point:{x:3, y:1}, from:{point:{x:2, y:0}, from:{point:{x:1, y:0}, from:{point:{x:0, y:0}, from:null, length:0, score:undefined}, length:100, score:2738}, length:222, score:2819}, length:555, score:3011}, length:752, score:3067}, length:1097, score:3271}, length:1245, score:3278}, length:1424, score:3316}, length:1569, score:3320}, length:1735, score:3345}, length:1877, score:3446}, length:2036, score:3464}, length:2210, score:3497}, length:2352, score:3498}, length:2546, score:3551}, length:2725, score:3589}, length:2938, score:3661}, length:3101, score:3683}, length:3248, score:3689}, length:3361, score:3702}, length:3510, score:3710}, length:3646, score:3746}, length:3783, score:3783};


var ROUTE_B = {point:{x:11, y:17}, from:{point:{x:11, y:16}, from:{point:{x:10, y:15}, from:{point:{x:10, y:14}, from:{point:{x:9, y:13}, from:{point:{x:8, y:12}, from:{point:{x:7, y:11}, from:{point:{x:6, y:10}, from:{point:{x:5, y:9}, from:{point:{x:4, y:8}, from:{point:{x:3, y:7}, from:{point:{x:2, y:6}, from:{point:{x:1, y:5}, from:{point:{x:1, y:4}, from:{point:{x:0, y:3}, from:{point:{x:0, y:2}, from:{point:{x:0, y:1}, from:{point:{x:0, y:0}, from:null, length:0, score:undefined}, length:288, score:2339}, length:434, score:2385}, length:534, score:2385}, length:693, score:2403}, length:847, score:2457}, length:1122, score:2591}, length:1311, score:2639}, length:1498, score:2685}, length:1672, score:2718}, length:1835, score:2740}, length:1987, score:2751}, length:2169, score:2792}, length:2364, score:2846}, length:2551, score:2892}, length:2731, score:2972}, length:2998, score:3098}, length:3280, score:3280};

var ROUTE_C = {point:{x:19, y:19}, from:{point:{x:18, y:19}, from:{point:{x:17, y:18}, from:{point:{x:16, y:17}, from:{point:{x:15, y:17}, from:{point:{x:14, y:17}, from:{point:{x:13, y:17}, from:{point:{x:12, y:17}, from:{point:{x:11, y:17}, length:0}, length:161, score:943}, length:338, score:1020}, length:505, score:1087}, length:656, score:1138}, length:801, score:1183}, length:962, score:1203}, length:1120, score:1220}, length:1256, score:1256};

var toSimplePoints = function(route) {
   if (!route) return null;
   
   return {point: {x: route.point.x, y: route.point.y}, from: toSimplePoints(route.from), length: route.length, score: route.score};
};

exports.testSearch = function () {
   var map = new Map();
   assert.deepEqual(toSimplePoints(astar.findRoute(map, point(0, 0), point(19, 19))), ROUTE_A);
   assert.deepEqual(toSimplePoints(astar.findRoute(map, point(0, 0), point(11, 17))), ROUTE_B);
  //    print (toSimplePoints(astar.findRoute(point(11, 17), point(19, 19))).toSource());
  // assert.deepEqual(toSimplePoints(astar.findRoute(point(11, 17), point(19, 19))), ROUTE_C);

};

if (require.main == module.id) {
    require('test').run(exports);
}




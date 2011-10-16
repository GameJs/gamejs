var astar = require('gamejs/pathfinding/astar');
qModule('gamejs/pathfinding/astar');

/**
 * This is an example implementation of a Map that can be passed to the `astar.findRoute()`
 * function.
 */
var Map = exports.Map = function() {

   // heights is height of points as 2dim array to make clear the difference
   // between estimated- and actual-Distance
   var HEIGHT_FIELD = [
                 [111,111,122,137,226,192,246,275,285,333,328,264,202,175,151,222,250,222,219,146],
                 [205,186,160,218,217,233,268,300,316,357,276,240,240,253,215,201,256,312,224,200],
                 [228,176,232,258,246,289,306,351,374,388,319,333,299,307,261,286,291,355,277,258],
                 [228,207,263,264,284,348,368,358,391,387,320,344,366,382,372,394,360,314,259,207],
                 [238,237,275,315,353,355,341,332,350,315,283,310,355,350,336,405,361,273,264,228],
                 [245,264,289,340,359,349,336,303,267,259,285,340,315,290,333,372,306,254,220,220],
                 [264,287,331,365,382,381,386,360,299,258,254,284,264,276,295,323,281,233,202,160],
                 [300,327,360,355,365,402,393,343,307,274,232,226,221,262,289,250,252,228,160,160],
                 [343,379,373,337,309,336,378,352,303,290,294,241,176,204,235,205,203,206,169,132],
                 [348,348,364,369,337,276,321,390,347,354,309,259,208,147,158,165,169,169,200,147],
                 [320,328,334,348,354,316,254,315,303,297,283,238,229,207,156,129,128,161,174,165],
                 [297,331,304,283,283,279,250,243,264,251,226,204,155,144,154,147,120,111,129,138],
                 [302,347,332,326,314,286,223,205,202,178,160,172,171,132,118,116,114, 96, 80, 75],
                 [287,317,310,293,284,235,217,305,286,229,211,234,227,243,188,160,152,129,138,101],
                 [260,277,269,243,236,255,343,312,280,220,252,280,298,288,252,210,176,163,133,112],
                 [266,255,254,254,265,307,350,311,267,276,292,355,305,250,223,200,197,193,166,158],
                 [306,312,328,279,287,320,377,359,289,328,367,355,271,250,198,163,139,155,153,190],
                 [367,357,339,330,290,323,363,374,330,331,415,446,385,308,241,190,145, 99, 88,145],
                 [342,362,381,359,353,353,369,391,384,372,408,448,382,358,256,178,143,125, 85,109],
                 [311,337,358,376,330,341,342,374,411,408,421,382,271,311,246,166,132,116,108, 72]
              ];


   this.adjacent = function(origin) {

      function insideMap(point) {
         return point[0] >= 0 && point[0] < HEIGHT_FIELD.length &&
            point[1] >= 0 && point[1] < HEIGHT_FIELD.length;
      }

      var directions = [[-1, 0], [1, 0], [0, -1],
                       [0, 1], [-1, -1], [-1, 1],
                       [1, 1], [1, -1]];

      var allPoints = directions.map(function(dir) {
         return [origin[0] + dir[0], origin[1] + dir[1]];
      });
      var inside = allPoints.filter(insideMap);
      return inside;
   };

   this.estimatedDistance = function(pointA, pointB) {
      var dx = Math.abs(pointA[0] - pointB[0]);
      var dy = Math.abs(pointA[1] - pointB[1]);
      if (dx > dy) {
         return (dx - dy) * 100 + dy * 141;
      } else {
         return (dy - dx) * 100 + dx * 141;
      }
   };

   this.actualDistance = function(pointA, pointB) {
      var self = this;
      function heightAt(point) {
         return HEIGHT_FIELD[point[1]][point[0]];
      }
      var heightDifference = heightAt(pointB) - heightAt(pointA);
      var climbFactor = (heightDifference < 0 ? 1 : 2);
      var flatDistance = (pointA[0] == pointB[0] || pointA[1] == pointB[1] ? 100 : 141);
      return flatDistance + climbFactor * Math.abs(heightDifference);
   };

   return this;
};

test('Search', function () {
   var map = new Map();

   deepEqual(astar.findRoute(map, [0,0], [19, 19]),
      {point:[19, 19], from:{point:[19, 18], from:{point:[19, 17], from:{point:[18, 16], from:{point:[18, 15], from:{point:[17, 14], from:{point:[16, 13], from:{point:[15, 12], from:{point:[14, 11], from:{point:[13, 10], from:{point:[12, 9], from:{point:[11, 8], from:{point:[10, 7], from:{point:[9, 7], from:{point:[8, 6], from:{point:[7, 5], from:{point:[6, 4], from:{point:[5, 3], from:{point:[4, 2], from:{point:[3, 1], from:{point:[2, 0], from:{point:[1, 0], from:{point:[0, 0], from:null, length:0}, length:100, score:2738}, length:222, score:2819}, length:555, score:3011}, length:752, score:3067}, length:1097, score:3271}, length:1245, score:3278}, length:1424, score:3316}, length:1569, score:3320}, length:1735, score:3345}, length:1877, score:3446}, length:2036, score:3464}, length:2210, score:3497}, length:2352, score:3498}, length:2546, score:3551}, length:2725, score:3589}, length:2938, score:3661}, length:3101, score:3683}, length:3248, score:3689}, length:3361, score:3702}, length:3510, score:3710}, length:3646, score:3746}, length:3783, score:3783}
   );

   deepEqual(astar.findRoute(map, [0,0], [12, 8]),
      {point:[12, 8], from:{point:[11, 7], from:{point:[10, 6], from:{point:[9, 5], from:{point:[8, 5], from:{point:[7, 4], from:{point:[6, 4], from:{point:[5, 3], from:{point:[4, 2], from:{point:[3, 1], from:{point:[2, 0], from:{point:[1, 0], from:{point:[0, 0], from:null, length:0}, length:100, score:1528}, length:222, score:1550}, length:555, score:1742}, length:752, score:1798}, length:1097, score:2002}, length:1245, score:2009}, length:1354, score:2018}, length:1560, score:2083}, length:1668, score:2091}, length:1814, score:2096}, length:1983, score:2124}, length:2174, score:2174}
   );

   deepEqual(astar.findRoute(map, [0,0], [4, 19]),
      {point:[4, 19], from:{point:[4, 18], from:{point:[4, 17], from:{point:[3, 16], from:{point:[2, 15], from:{point:[2, 14], from:{point:[2, 13], from:{point:[2, 12], from:{point:[1, 11], from:{point:[1, 10], from:{point:[1, 9], from:{point:[0, 8], from:{point:[0, 7], from:{point:[0, 6], from:{point:[0, 5], from:{point:[0, 4], from:{point:[0, 3], from:{point:[0, 2], from:{point:[0, 1], from:{point:[0, 0], from:null, length:0}, length:288, score:2252}, length:434, score:2298}, length:534, score:2298}, length:654, score:2318}, length:768, score:2332}, length:906, score:2370}, length:1078, score:2442}, length:1264, score:2528}, length:1415, score:2538}, length:1535, score:2558}, length:1641, score:2564}, length:1784, score:2566}, length:1906, score:2588}, length:2047, score:2629}, length:2162, score:2644}, length:2353, score:2694}, length:2516, score:2716}, length:2742, score:2842}, length:2865, score:2865}
   );
   deepEqual(astar.findRoute(map, [0,0], [5, 5]),
      {point:[5, 5], from:{point:[4, 4], from:{point:[3, 3], from:{point:[2, 2], from:{point:[1, 1], from:{point:[0, 0], from:null, length:0}, length:291, score:855}, length:524, score:947}, length:729, score:1011}, length:1048, score:1189}, length:1193, score:1193}
   );
});

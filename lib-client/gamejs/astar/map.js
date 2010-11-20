/**
 * Example Point implementation
 * The same interface must be provided for a custom Point class
 */
var Point = exports.Point = function() {
   this.x = arguments[0];
   this.y = arguments[1];
   return this;
}

/**
 * Unique hash for the point on a map
 */
Point.prototype.hash = function() {
  return this.x + "-" + this.y;
};

/**
 * Add two points together and return the new point
 */
Point.prototype.add = function(b) {
   return new Point(this.x + b.x, this.y + b.y)
};

/**
 * Are two points equal
 */
Point.prototype.equals = function(b) {
   return this.x == b.x && this.y == b.y;
};

/** convinient constructor **/
var point = exports.point = function() {
   return (new Point(arguments[0], arguments[1]));
};

/**
   map exaple implementation.
   
   required function:
     * adjacent(point) return list of adjecent, accessible points
     * estimatedDistance(pointA, pointB) rough, lower bound for distance
     * weightedDistance(pointA, pointB) actual distance between two points
   
 **/
var Map = exports.Map = function() {
   this.heights = [[111,111,122,137,226,192,246,275,285,333,328,264,202,175,151,222,250,222,219,146],
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
   return this;
};
Map.prototype.adjacent = function(origin) {
   function insideMap(point) {
      return point.x >= 0 && point.x < this.heights.length &&
         point.y >= 0 && point.y < this.heights.length;
   }

   var directions = [point(-1, 0), point(1, 0), point(0, -1),
                    point(0, 1), point(-1, -1), point(-1, 1),
                    point(1, 1), point(1, -1)];

   var allPoints = directions.map(origin.add, origin);
   return allPoints.filter(insideMap, this);
};

Map.prototype.estimatedDistance = function(pointA, pointB) {
   var dx = Math.abs(pointA.x - pointB.x),
      dy = Math.abs(pointA.y - pointB.y);
   if (dx > dy) {
      return (dx - dy) * 100 + dy * 141;
   } else {
      return (dy - dx) * 100 + dx * 141;
   }
};

Map.prototype.weightedDistance = function(pointA, pointB) {
   var self = this;
   function heightAt (point) {
      return self.heights[point.y][point.x];
   }
   var heightDifference = heightAt(pointB) - heightAt(pointA);
   var climbFactor = (heightDifference < 0 ? 1 : 2);
   var flatDistance = (pointA.x == pointB.x || pointA.y == pointB.y ? 100 : 141);
   return flatDistance + climbFactor * Math.abs(heightDifference);
}

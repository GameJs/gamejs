/**
 * @fileoverview
 * This loads a TMX Map and allows you to scroll over the map
 * with the cursor keys.
 *
 * Try to open the "data/cute.tmx" file with the Tiled map editor to
 * see how the layers work and how the image for the tiles is specified.
 *
 * There are several useful classes inside the "view.js" module, which
 * help with rendering all the layers of a map.
 *
 * Note how inside the tmx-file the necessary Tilesets are specified
 * relative - this is the easiest way to get them to automatically load
 * with the map.
 *
 */
var gamejs = require('gamejs');
var tiledmap = require('gamejs/tiledmap');

gamejs.preload(['./data/tilesheet.png']);

/**
 * Loads the tmx at the given URL and holds all layers.
 */
var Map = exports.Map = function(url) {

   // you can optionall pass a rectangle specification
   // to control where on the display the mapView
   // is drawn
   this.draw = function(display) {
      mapView.draw(display, [0,0]);
   };

   // change the mapView.viewRect to "scroll" to
   // a different part of the map.
   this.keyUpHandler = function(event) {
       var xdiff = 0;
       var ydiff = 0;
       if (event.key === gamejs.event.K_LEFT) {
          xdiff = -50;
       } else if (event.key === gamejs.event.K_RIGHT) {
          xdiff = 50;
       } else if (event.key === gamejs.event.K_DOWN) {
          ydiff = 50;
       } else if (event.key === gamejs.event.K_UP) {
          ydiff = -50;
       }
       // dont go outside the map
       mapView.viewRect.left = Math.max(0, mapView.viewRect.left + xdiff);
       mapView.viewRect.top = Math.max(0, mapView.viewRect.top + ydiff);

   };

   /**
    * constructor
    */
   var map = new tiledmap.Map(url);
   var mapView = new tiledmap.MapView(map);
   return this;
};

gamejs.ready(function() {
   gamejs.display.setCaption('TMX viewer');
   var display = gamejs.display.getSurface();

   var map = new Map('./data/example.tmx');

   gamejs.event.onKeyUp(map.keyUpHandler, map);

   gamejs.onTick(function(msDuration) {
      display.clear();
      map.draw(display);
   });
});

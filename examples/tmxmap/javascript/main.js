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
var view = require('./view');

gamejs.preload(['./data/tilesheet.png']);

gamejs.ready(function() {
   gamejs.display.setCaption('TMX viewer');
   var display = gamejs.display.setMode([800, 500]);

   var map = new view.Map('./data/example.tmx');

   var tick = function(msDuration) {
      gamejs.event.get().forEach(function(event) {
         map.handle(event);
      });
      map.update(msDuration);
      display.clear();
      map.draw(display);
   };

   gamejs.time.fpsCallback(tick, this, 60);

});

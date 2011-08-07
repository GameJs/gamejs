/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */
var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');

function main() {
   // set resolution & title
   var display = gamejs.display.setMode([800, 600]);
   gamejs.display.setCaption("Example Draw");

   var colorOne = '#ff0000';
   var colorTwo = 'rgb(255, 50, 60)';
   var colorThree = 'rgba(50, 0, 150, 0.8)';

   // All gamejs.draw methods share the same parameter order:
   //
   //  * surface
   //  * color
   //  * position related: gamejs.Rect or [x,y] or array of [x, y]
   //  * [second position if line]
   //  * [radius if circle]
   //  * line width; 0 line width = fill the structure

   // surface, color, startPos, endPos, width
   draw.line(display, colorOne, [0,0], [100,100], 1);
   draw.lines(display, colorOne, true, [[50,50], [100,50], [100,100], [50,100]], 4);

   draw.polygon(display, colorTwo, [[155,35], [210,50], [200,100]], 0);

   // surface, color, center, radius, width
   draw.circle(display, colorThree, [150, 150], 50, 10);
   draw.circle(display, '#ff0000', [250, 250], 50, 0);

   // surface, color, rect, width
   draw.rect(display, '#aaaaaa', new gamejs.Rect([10, 150], [20, 20]), 2);
   draw.rect(display, '#555555', new gamejs.Rect([50, 150], [20, 20]), 0);
   draw.rect(display, '#aaaaaa', new gamejs.Rect([90, 150], [20, 20]), 10);

   // Font object, create with css font definition
   var defaultFont = new font.Font("20px Verdana");
   // render() returns a white transparent Surface containing the text (default color: black)
   var textSurface = defaultFont.render("Example Draw Test 101", "#bbbbbb");
   display.blit(textSurface, [300, 50]);
};

// gamejs.ready will call your main function
// once all components and resources are ready.
gamejs.ready(main);

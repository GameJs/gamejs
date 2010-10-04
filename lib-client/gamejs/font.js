var Surface = require('gamejs').Surface;

/**
 * @fileoverview Methods for creating Font objects which can render text
 * to a Surface.
 *
 * Example:
 *     // create a font
 *     var font = new Font('20px monospace', 'rgb(255, 0, 0));
 *     // render text - this returns a surface with the text written on it.
 *     var renderedTextSurface = font.render('Hello World');
 */

/**
 * Create a Font to draw on the screen. The Font allows you to
 * `render()` text. Rendering text returns a Surface which
 * in turn can be put on screen.
 * @constructor
 * @property {Number} fontHeight the line height of this Font
 *
 * @param {String} fontSettings a css font definition, e.g., "20px monospace"
 * @param {STring} backgroundColor valid #rgb string, "#ff00cc"
 */
var Font = exports.Font = function(fontSettings, backgroundColor) {
    /**
     * @ignore
     */
   this.sampleSurface = new Surface([10,10]);
   this.sampleSurface.context.font = fontSettings;
   return this;
};

/**
 * Returns a Surface with the given text on it.
 * @param {String} text the text to render
 * @param {String} color a valid #RGB String, "#ffcc00"
 * @returns {gamejs.Surface} Surface with the rendered text on it.
 */
Font.prototype.render = function(text, color) {
   var dims = this.size(text);
   var surface = new Surface(dims);
   var ctx = surface.context;
   ctx.save();
   ctx.font = this.sampleSurface.context.font;
   ctx.fillStyle = ctx.strokeStyle = color || "#000000";
   ctx.fillText(text, 0, dims[1]-1);
   ctx.restore();
   return surface;
};

/**
 * Determine the width and height of the given text if rendered
 * with this Font.
 * @param {String} text the text to measure
 * @returns {Number[]} the width and height of the text if rendered with this Font
 */
Font.prototype.size = function(text) {
   var metrics = this.sampleSurface.context.measureText(text);
   return [metrics.width, this.fontHeight];
};


Font.prototype.__defineGetter__("fontHeight", function() {
   var fontSettingParts = this.sampleSurface.context.font.split(" ");
   var height = 10; // default is 10px
   // first with px is font height
   fontSettingParts.some(function(part) {
      if (part.substr(-2) === "px") {
         height = parseInt(part.substring(0, part.length-2));
         return true;
      }
      return false;
   }, this);
   return height;
});

/**
 * @fileoverview Touch example
 *
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
 *
 */

var gamejs = require('gamejs');

// create random color from touch identifier
function colorForTouch(touch) {
   var id = touch.identifier + (100 * Math.random());
  var r = Math.floor(id % 16);
  var g = Math.floor(id / 3) % 16;
  var b = Math.floor(id / 7) % 16;
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  var color = "#" + r + g + b;
  gamejs.logging.log(color)
  return color;
}

function main() {
   // minus margin and footer
  var display = gamejs.display.setMode([document.body.clientWidth-50, window.innerHeight-120]);


  // keep track of the ongoing touches
  var onGoingTouches = {};
  function touchDown(event) {
    event.touches.forEach(function(touch) {
       onGoingTouches[touch.identifier] = touch;
       onGoingTouches[touch.identifier].color = colorForTouch(touch);
       // draw circle at start
       gamejs.graphics.circle(display, '#ff0000', touch.pos, 5);
    });
  };

  function touchUp(event) {
    event.touches.forEach(function(touch) {
       onGoingTouches[touch.identifier] = undefined;
       // draw circle at end
       gamejs.graphics.circle(display, '#ff0000', touch.pos, 5);
    })
  };

  function touchMotion (event) {
    event.touches.forEach(function(touch) {
       // keep track of previous and current position
       var aTouch = onGoingTouches[touch.identifier];
       aTouch.lastPos = aTouch.pos;
       aTouch.pos = touch.pos;
       // draw movement
       gamejs.graphics.line(display, aTouch.color, aTouch.lastPos, aTouch.pos, 3);
    })
  };

  gamejs.event.onTouchDown(touchDown);
  gamejs.event.onTouchUp(touchUp);
  gamejs.event.onTouchMotion(touchMotion);
};


gamejs.ready(main);

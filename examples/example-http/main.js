/** 
 * A JS object is loaded from the server and its property 'text' rendered
 * to the screen.
 *
 * see server.js for server side of this app
 */
var gamejs = require('gamejs');

function main() {
   var display = gamejs.display.setMode([800, 450]);
   var font = new gamejs.font.Font('30px monospace');

   var response = gamejs.http.load('foobar');
   var text = 'Server says: ' + response.text;
   display.blit(font.render(text), [100, 100]);
};

gamejs.ready(main);

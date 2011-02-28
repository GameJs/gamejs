/**
 * @fileoverview
 * A simple game. One way to have a game with multiple screens and the possibility
 * to restart it.
 */
var gamejs = require('gamejs');
// Tyround is a custom module written for this example. Use a relative require()
// as shown here to load it.
// .. appropriatly most of the code lives in `tyround.js`.
var tyround = require('./tyround');

function main() {
   gamejs.display.setCaption("Tyround");

   // tyround.Game creates a {gamejs/extra.Scene} and
   // has setup*Screen functions that
   // setup that scene for the various screens (splash, game, gameover).
   var game = new tyround.Game();
   game.startSplashScene();
};

gamejs.preload([
   "images/ship_wings.png",
   "images/rocket.png",
   "images/planet.png",
   "images/shuriken.png",
   "images/starbackground.png",
   "images/fireball.png",
   "images/startscreen.png",
   "images/clicktoplay.png",
   "images/100points.png",
   "images/250points.png",
   "images/greendiamond_0.png",
   "images/greendiamond_1.png",
   "images/greendiamond_2.png",
   "images/greendiamond_3.png",
   "images/greendiamond_4.png",
   "images/greendiamond_5.png",
/*
   "./sounds/rocket.ogg",
   "./sounds/explosion0.ogg",
   "./sounds/explosion1.ogg",
*/
]);
gamejs.ready(main);

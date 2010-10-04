/**
 * Copyright
 * Code: Simon Oberhammer
 * Graphics: lostgarden.com & NASA
 */
 
var gamejs = require('gamejs');
var tysprites = require('./tysprites');

var scene;
function main() {
   gamejs.display.setCaption("Tyround");
   scene = new gamejs.extra.Scene([800, 500]);
   scene.background = gamejs.image.load('images/startscreen.png');
   var screenRect = scene.screen.getRect();

   /**
    * Highest Game Logic
    */
   var initGame = function() {
      scene.stop();
      scene.background = gamejs.image.load('images/starbackground.png');


      // for rocket that will be created during game
      var rocketGroup = new gamejs.sprite.Group();
      scene.addGroup(rocketGroup);

      // diamonds created by planet explosions
      var diamondGroup = new gamejs.sprite.Group();
      scene.addGroup(diamondGroup)
      
      // for explosions by anyone
      var explosionGroup = new gamejs.sprite.Group();
      scene.addGroup(explosionGroup);

      // group for rockets shot by planets
      var shurikenGroup = new gamejs.sprite.Group();
      scene.addGroup(shurikenGroup);

      // score various
      var scoreGroup = new gamejs.sprite.Group();
      scene.addGroup(scoreGroup);

      // player ship
      var ship = new tysprites.Ship(explosionGroup, scene);
      ship.turnBy(45);
      scene.sprites.push(ship);

      // add a couple of planets at random position
      var planetGroup = new gamejs.sprite.Group();
      scene.addGroup(planetGroup);
      while (planetGroup.sprites().length < 10) {
         var planet = new tysprites.Planet([
                                 (screenRect.width - 110) * Math.random() + 100,
                                 (screenRect.height - 110) * Math.random() + 100
                              ], 
                              ship,
                              shurikenGroup,
                              explosionGroup,
                              diamondGroup,
                              scoreGroup,
                              scene
                              );
         planetGroup.add(planet);
      }
      
      var gui = new tysprites.Gui(scene, ship, planetGroup, initGameOver);
      scene.sprites.push(gui);
      var msLastRocket = 0;
      var msLastBoost = 0;
      scene.doEvents = function(event) {
         if (event.type == gamejs.event.KEYDOWN) {
            if (event.key == gamejs.event.K_LEFT) {
               ship.rotateDir = -1;
            } else if (event.key == gamejs.event.K_RIGHT) {
               ship.rotateDir = 1;
            } else if (event.key == gamejs.event.K_DOWN) {
               ship.speed = 1;
            } else if (event.key == gamejs.event.K_UP) {
               ship.speed = 2;
               var now = Date.now();
               if (now - msLastBoost > 5000) {
                  ship.speed = 6;
               }
            } else if (event.key == gamejs.event.K_SPACE) {
               var now = Date.now();
               if (now - msLastRocket > 500) {
                  // shoot rocket
                  var rocket = new tysprites.Rocket(scene, ship.rect.center, ship.heading);
                  rocketGroup.add(rocket);
                  if (false) (new gamejs.mixer.Sound("sounds/rocket.ogg")).play();
                  msLastRocket = now;
               }
            }
         } else if (event.type == gamejs.event.KEYUP) {
            if ([gamejs.event.K_LEFT, gamejs.event.K_RIGHT].indexOf(event.key) > -1) {
               ship.rotateDir = 0;
            } else if (event.key === gamejs.event.K_m) {
               //PLAY_SOUNDS = !PLAY_SOUNDS;
            }
         }
      }
      // handle collisions
      scene.update = function() {

         gamejs.sprite.groupCollide(rocketGroup, planetGroup, true, true);

         var checkShipCollide = function(item) {
            if (gamejs.sprite.collideRect(item, ship)) {
               ship.kill();
               return true;
            }
            return false;
         }
         
         // ship hit planet
         planetGroup.sprites().forEach(checkShipCollide);
         // ship hit by shuriken
         shurikenGroup.sprites().forEach(checkShipCollide);

         // ship hit diamonds?
         diamondGroup.sprites().forEach(function(diamond) {
            if (gamejs.sprite.collideRect(diamond, ship)) {
               scoreGroup.add(new tysprites.Scorepoints(diamond.rect.center, 250));
               gui.diamondScore += 250;
               diamond.kill();
            }
         });
         
         return;
      };
      scene.start(30);
      return;
   }

   /**
    * Startscreen Logic
    */
   var rectStartButton = new gamejs.Rect([254, 376], [295, 80]);
   var initStartScreen = function() {
      scene.stop();
      scene.update = function() {};

      scene.doEvents = function(event) {
         if (event.type == gamejs.event.MOUSEUP) {
            if (rectStartButton.collidePoint(event.pos)) {
               initGame();
            }
         } else if (event.type == gamejs.event.KEYUP) {
            if (event.key === gamejs.event.K_ENTER) {
               initGame();
            }
         }
      }
      scene.start(30);
      return;
   };

   /**
    * Game Over Screen Logic
    */
   var initGameOver = function(totalScore, scoreInfo) {
      scene.stop();      
      var gameoverFont = new gamejs.font.Font("100px Verdana");
      var scoreFont = new gamejs.font.Font("20px Verdana");
      scene.background = new Surface([screenRect.width, screenRect.height]);
      var scoreString = totalScore.toString();
      while(scoreString.length < 4) {
         scoreString = "0" + scoreString;
      }
      scene.background.blit(gameoverFont.render('SCORE: ' + scoreString, '#e700d5'), [50, 100]);
      scene.background.blit(gamejs.image.load('images/clicktoplay.png'), rectStartButton);
      var offset = 0;
      scoreInfo.forEach(function(info) {
         var key = info.key;
         var value = info.value;
         var key = key === 'msg' ? '' : key;
         scene.background.blit(scoreFont.render(value +" " + key, '#e700d5'), [100, 220 + offset]);
         offset += 25;
      });
      scene.doEvents = function(event) {
         if (event.type == gamejs.event.MOUSEUP) {
            if (rectStartButton.collidePoint(event.pos)) {
               initGame();
            }
         } else if (event.type == gamejs.event.KEYUP) {
            if (event.key === gamejs.event.K_ENTER) {
               initGame();
            }
         }
      }
      scene.start(30);

      return;
   }
   
   // startup the start screen
   initStartScreen();
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

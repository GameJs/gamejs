var gamejs = require('gamejs');
var Surface = require('gamejs').Surface;

var tysprites = require('./tyround/sprites');

/**
 * We use gamejs/scene.Scene which deals with the actual event loop, screen rendering
 * object updates, etc. for a very basic game.
 *
 * Your games will typically be similarly to gamejs/scene.Scene:
 * have a bunch of SpriteGroups, update them, draw them, do collision detection
 * amongst them and rect to events from the event loop.
 *
 * Scene provides a default, quick-start implementation for getting something
 * on the screen fast.
 * 
 * All we have here are a bunch of functions for configuring 
 * the scene for one of:
 *
 *  * the splash screen
 *  * the game itself
 *  * the highcsore
 *
 * Mouse stuff is always a bit cumbersome with canvas.
 */
exports.Game = function() {
   var scene = new gamejs.scene.Scene([800, 500]);
   var screenRect = scene.screen.getRect();

   /**
    * Setup a scene which shows the splash screen and
    * handles the splace sreen UI.
    */
   this.startSplashScene = function() {
      scene.stop();
      
      scene.background = gamejs.image.load('images/startscreen.png');
      
      // hardcoded position of startbutton in splash screen background
      var rectStartButton = new gamejs.Rect([254, 376], [295, 80]);
      
      // clear the update function if any
      scene.update = function() {};
      
      scene.doEvents = function(event) {
         // handle mouse events
         if (event.type == gamejs.event.MOUSE_UP) {
            // die user click the startbutton?
            if (rectStartButton.collidePoint(event.pos)) {
               startGameScene();
            }
         } else if (event.type == gamejs.event.KEY_UP) {
            // .. or press enter?
            if (event.key === gamejs.event.K_ENTER) {
               startGameScene();
            }
         }
      }
      scene.start(30);
      return;
   };
   
   /**
    * Setup the scene for the actual game. This has more elaborate
    * event handling & per frame update functions which are extracted into the 
    * game* functions.
    */
   function startGameScene() {
   
      /**
       * periodically called model updater used when the game is running. Mostly
       * has to deal with collision detection in this game.
       *
       * @see startGameScene
       */
      function gameUpdate() {
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
      
      /**
       * event handling function when game is running
       * @see startGameScene
       */
      function gameDoEvents(event) {
         if (event.type == gamejs.event.KEY_DOWN) {
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
         } else if (event.type == gamejs.event.KEY_UP) {
            if ([gamejs.event.K_LEFT, gamejs.event.K_RIGHT].indexOf(event.key) > -1) {
               ship.rotateDir = 0;
            } else if (event.key === gamejs.event.K_m) {
               //PLAY_SOUNDS = !PLAY_SOUNDS;
            }
         }
      };
   
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
      
      /**
       * the gui is just a sprite
       */
      var gui = new tysprites.Gui(scene, ship, planetGroup, startGameOverScene);
      scene.sprites.push(gui);
      var msLastRocket = 0;
      var msLastBoost = 0;
      // event handling & model updating per frame is
      // extracted into seperate functions
      scene.doEvents = gameDoEvents;
      scene.update = gameUpdate;
      scene.start(30);
      return;
   };
   
   /**
    * Setup scene for game over - score & possibility to restart.
    */
   function startGameOverScene(totalScore, scoreInfo) {
      // hardcoded position of startbutton in splash screen background
      var rectStartButton = new gamejs.Rect([254, 376], [295, 80]);

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
         if (event.type == gamejs.event.MOUSE_UP) {
            if (rectStartButton.collidePoint(event.pos)) {
               startGameScene();
            }
         } else if (event.type == gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_ENTER) {
               startGameScene();
            }
         }
      }
      scene.start(30);
      return;
   };
   return this;
}

var gamejs = require('gamejs');
var client = require('gamejs/network/client');

var font = new gamejs.font.Font();

var Game = function(networkController) {
   this.allGames = [];
   
   this.update = function(msDuration) {
      gamejs.event.get().forEach(function(event) {
         if (event.type === gamejs.event.NET_CONNECTED) {
            gamejs.log('client connected');
         } else if (event.type === gamejs.event.NET_GAMELIST) {
            this.allGames = event.gameIds;
            gamejs.log('got game list ');
         } else if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_m) {
               gamejs.log('requesting game list');
               networkController.queryGames();
            } else if (event.key === gamejs.event.K_c) {
               gamejs.log('creating game in game instance');
               networkController.createGame();
            } else if (gamejs.event.K_0 <= event.key && event.key <= gamejs.event.K_9) {
               gamejs.log('joining ');
               var newGameId = this.allGames[event.key - 48];
               networkController.joinGame(newGameId);
            } else if (gamejs.event.K_l == event.key) {
               networkController.leaveGame();
            }
         }
      }, this);
   };
   
   return this;
};


function main() {
   var networkController = new client.NetworkController();
   var game = new Game(networkController);
      
   // init
   gamejs.display.setMode([800, 600]);
   gamejs.display.setCaption("Example Network");
   
   // game loop
   var mainSurface = gamejs.display.getSurface();
   var tick = function(msDuration) {
      game.update();
      mainSurface.fill("#FFFFFF");
      var text = 'Press m to query game list; c to create game; l to leave the game and approp number to join that game';
      mainSurface.blit(font.render(text));
      var y = 50;
      game.allGames.forEach(function(gid, idx) {
         mainSurface.blit(font.render(idx + ', #' + gid), [20, y + (idx*30)]);
      }, this);
   };
   gamejs.time.fpsCallback(tick, this, 30);

};

gamejs.ready(main);

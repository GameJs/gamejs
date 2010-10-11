var gamejs = require('gamejs');
var client = require('gamejs/network/client');

var font = new gamejs.font.Font();

var TPL = {};

function Game(networkController) {
   
   this.update = function(msDuration) {
      gamejs.event.get().forEach(function(event) {
         if (event.type === gamejs.event.NET_CONNECTED) {
            gamejs.log('client connected');
         } else if (event.type === gamejs.event.NET_GAMELIST) {
            $('#gj-network-gamelist').html(TPL.gameList({
               games: event.games
            }));
            gamejs.log('got game list ');
         }
      }, this);
   };
   
   return this;
};


function main() {
   // handlebar html templates for later usage precompiled
   TPL.gameList = Handlebars.compile($('[tpl=gameList]').text());

   var networkController = new client.NetworkController();
   var game = new Game(networkController);

   // init
   gamejs.display.setCaption("Example Network");
   
   $('#gj-refresh').click(function() {
      networkController.queryGames();
   });
   $('.gj-join').live('click', function() {
      var $this = $(this);
      networkController.joinGame($this.attr('gameId'));
   });
   $('#gj-leave').click(function() {
      var $this = $(this);
      networkController.leaveGame();
   });
   $('#gj-create').click(function() {
      var $this = $(this);
      networkController.createGame();
   });
   
   // game loop
   var mainSurface = gamejs.display.getSurface();
   var tick = function(msDuration) {
      game.update();      
   };
   gamejs.time.fpsCallback(tick, this, 30);

};

gamejs.ready(main);

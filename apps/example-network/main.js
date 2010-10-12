var gamejs = require('gamejs');

// This game implemententation only shows the lobby list
// and allows the player to create/join/leave a game instance.
//
// A real game would - once the player is connected, as shown here - mostly
// communicate with its serverside class implementing gamejs.network.server.Game
// which automatically recieves all messages a connected client sends.
// 
// For sending messages from the client to the server the Game holds a reference
// of all players, instances of gamejs.network.server.Player.
//
function Game(networkController) {   

   // log messages
   var $messages = $('#gj-messages');
   function log(msg) {
      $messages.prepend(TPL.messageItem({
         text: (Date.now() +'').substr(-5) + ' // ' + msg,
      }));   
   };

   this.update = function(msDuration) {
      // handle events, network events appear in the usual gamejs.event queue
      // once a gamejs.network.client.NetworkController is connected.
      gamejs.event.get().forEach(function(event) {
         if (event.type === gamejs.event.NET_SERVER_HELLO) {
            log('Succesfully connected to GameJs server');
            networkController.queryGames();
         } else if (event.type === gamejs.event.NET_SERVER_DISCONNECT) {
            log('Disconnected from GameJs server');
         } else if (event.type === gamejs.event.NET_SERVER_GAMELIST) {
            $('#gj-network-gamelist').html(TPL.gameList({
               games: event.games
            }));
            log('Recieved new game list');
         } else if (event.type === gamejs.event.NET_SERVER_JOINED) {
            log('Player#' + event.player.id + ' joined Game#' + event.gameId);
            networkController.queryGames();
         } else if (event.type === gamejs.event.NET_SERVER_LEFT) {
            log('Player#' + event.player.id + ' left Game#' + event.gameId);
            networkController.queryGames();
         }
      }, this);
   };
   
   return this;
};

// template holder
var TPL = {};

// main function being called once gamejs is ready
function main() {
   // compile handlebar html templates for later usage
   TPL.gameList = Handlebars.compile($('[tpl=gameList]').text());
   TPL.messageItem = Handlebars.compile($('[tpl=messageItem]').text());
   
   // start network controller - auto connects to gamejs
   var networkController = new gamejs.network.client.NetworkController();
   var game = new Game(networkController);

   // init
   gamejs.display.setCaption("Example Network");
   
   // button interaction
   $('#gj-leave').hide();
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
   
   // game handles the event queue
   var tick = function(msDuration) {
      game.update();      
   };
   gamejs.time.fpsCallback(tick, this, 30);

};

// call main once fully loaded
gamejs.ready(main);

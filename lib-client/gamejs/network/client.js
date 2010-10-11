/**
 * @fileOverview Networking functionality for the clientside.
 */
var gamejs = require('gamejs');

/**
 * Creating a NetworkController automatically connects to the GameJs
 * app server for this app. Call methods on the NetworkController for
 * joining, leaving or creating games.
 */
var NetworkController = exports.NetworkController = function () {
   var host = $g.websocketHost;
   var appId = $g.appId;
   var self = this;
   var gameId = null;
   var playerId = null;
   var players = [];
   /**
    * List of available games. Can be updated with {#queryGames}.
    * @see {queryGames}
    */
   this.games = [];
   
   /** 
    * Send an event to the server by passing it to this function.
    */
   this.send = function(event) {
      event.appId = event.appId || appId;
      event.gameId = event.gameId || gameId;
      event.playerId = event.playerId || playerId;
      ws.send(JSON.stringify(event))
      return;
   };
      
   /**
    *
    * @ignore
    */
   this.dispatch = function(event) {
      // PLAYER CREATED -> only i get it
      if (event.type === gamejs.event.NET_SERVER_HELLO) {
         playerId = event.playerId;
      // PLAYER JOINED
      } else if (event.type === gamejs.event.NET_SERVER_JOINED) {
         if (event.player.id === playerId) {
            gameId = event.gameId;
         }
         players.push(event.player);
      // PLAYER LEFT
      } else if (event.type === gamejs.event.NET_SERVER_LEFT) {
         // FIXME if it's myself do something
         players = players.filter(function(pl) {
            return pl.id !== event.player.id
         }, this);
      // this PLAYER CREATED GAME -> requery game list & join it
      } else if (event.type === gamejs.event.NET_SERVER_CREATED_GAME) {
         this.queryGames();
         this.joinGame(event.gameId);
      }
      // foward to pygame event queue
      gamejs.event.post(event);
   };
   
   /**
    * Request creating of new game.
    */
   this.createGame = function() {
      this.send({
         type: gamejs.event.NET_CLIENT_CREATE_GAME,
      });
   };
   
   /**
    * Request to join an existing game.
    */
   this.joinGame = function(gameId) {
      this.send({
         type: gamejs.event.NET_CLIENT_JOIN,
         gameId: gameId
      });   
   };
   
   /**
    * Request leaving the game this networkcontroller is connected to.
    */
   this.leaveGame = function() {
      this.send({
         type: gamejs.event.NET_CLIENT_LEAVE
      });
   };
   
   /**
    * Update `games` list of this NetworkController.
    */
   this.queryGames = function() {
      this.send({
         type: gamejs.event.NET_CLIENT_GAMELIST
      });   
   };
   
   /**
    * consructor
    *
    */
   var ws = new WebSocket("ws://" + host + "/game");
   ws.onopen = function() {
      self.send({
         type: gamejs.event.NET_CLIENT_HELLO
      });
   }
   ws.onclose = function() {
      gamejs.event.post({
         type: gamejs.event.NET_SERVER_DISCONNECT
      });
   }
   ws.onerror = function() {
      gamejs.log('websocket error');
   }
   ws.onmessage = function(e) {
      var data = JSON.parse(e.data);
      self.dispatch(data);
   }
   
   return this;
};

var gamejs = require('gamejs');

var NetworkController = exports.NetworkController = function () {
   var host = $g.websocketHost;
   var appId = $g.appId;
   var self = this;
   var gameId = null;
   var playerId = null;
   var players = [];
   /**
    * list of available games
    * @see {queryGames}
    */
   this.games = [];
   
   /** 
    *
    */
   this.send = function(event) {
      event.appId = event.appId || appId;
      event.gameId = event.gameId || gameId;
      event.playerId = event.playerId || playerId;
      ws.send(JSON.stringify(event))
      return;
   };
      
   /**
    * return false if the event should be handled locally by gamejs.event.queue
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
   
   this.createGame = function(gameId) {
      this.send({
         type: gamejs.event.NET_CLIENT_CREATE_GAME,
      });
   };
   
   this.joinGame = function(gameId) {
      this.send({
         type: gamejs.event.NET_CLIENT_JOIN,
         gameId: gameId
      });   
   };
   
   this.leaveGame = function() {
      this.send({
         type: gamejs.event.NET_CLIENT_LEAVE
      });
   };
   
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

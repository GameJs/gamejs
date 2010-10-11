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
         gamejs.event.post({
            type: gamejs.event.NET_CONNECTED,
         });
         gamejs.log('player created');
         return true;
      // PLAYER JOINED
      } else if (event.type === gamejs.event.NET_SERVER_JOINED) {
         if (event.player.id === playerId) {
            gameId = event.gameId;
         }
         players.push(event.player);
         gamejs.log('player joined player#' + event.player.id + ' game #' + event.gameId);
         return true;
      // PLAYER LEFT
      } else if (event.type === gamejs.event.NET_SERVER_LEFT) {
         // FIXME if it's myself do something
         players = players.filter(function(pl) {
            return pl.id !== event.player.id
         }, this);
         gamejs.log('player kicked');
         return true;
      // this PLAYER CREATED GAME -> requery game list & join it
      } else if (event.type === gamejs.event.NET_SERVER_CREATED_GAME) {
         this.queryGames();
         this.joinGame(event.gameId);
      } else if (event.type === gamejs.event.NET_SERVER_GAMELIST) {
         gamejs.event.post({
            type: gamejs.event.NET_GAMELIST,
            gameIds: event.gameIds,
         });
      }
      return false;
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
   console.log("ws://" + host + "/game");
   ws.onopen = function() {
      gamejs.log('Connected to server, creating user...');
      self.send({
         type: gamejs.event.NET_CLIENT_HELLO
      });
   }
   ws.onclose = function() {
      gamejs.log('Connection to server lost');
   }
   ws.onerror = function() {
      gamejs.log('websocket error');
   }
   ws.onmessage = function(e) {
      var data = JSON.parse(e.data);
      if (!self.dispatch(data)) {
         gamejs.event.post(data);
      }
   }
   
   return this;
};

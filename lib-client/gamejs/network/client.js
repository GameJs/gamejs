var gamejs = require('gamejs');
var events = require('gamejs/network/events');

var NetworkController = exports.NetworkController = function (host, appId) {
   var self = this;
   var gameId = null;
   var playerId = null;
   var players = [];
   var allGames = [];
   
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
      if (event.type === events.GAME_PLAYER_CREATED) {
         playerId = event.playerId;
         gamejs.event.post({
            type: events.CLIENT_CONNECTED,
         });
         gamejs.log('player created');
         return true;
      // PLAYER JOINED
      } else if (event.type === events.GAME_PLAYER_JOINED) {
         if (event.player.id === playerId) {
            gameId = event.gameId;
         }
         players.push(event.player);
         gamejs.log('player joined player#' + event.player.id + ' game #' + event.gameId);
         return true;
      // PLAYER LEFT
      } else if (event.type === events.GAME_PLAYER_LEFT) {
         // FIXME if it's myself == i got kicked
         players = players.filter(function(pl) {
            return pl.id !== event.player.id
         }, this);
         gamejs.log('player kicked');
         return true;
      }
      return false;
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
         type: events.PLAYER_CREATE
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

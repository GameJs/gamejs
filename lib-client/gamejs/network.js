var Game = exports.Game = function(eventHandler) {
   var eventHandler.register(this);
   
   return this;
};

Game.prototype.joinGame = function(gameId) {
   eventHandler.dispatch({
      gamejs: {
         type: gamejs.network.events.CLIENT_JOIN,
         gameId: gameId,
      }
   });
};

Game.prototype.leaveGame = function() {
   eventHandler.dispatch({
      gamejs: {
         type: gamejs.network.events.CLIENT_LEAVE,
         gameId: gameId,
      }
   });
}

Game.prototype.readyGame = function() {
   eventHandler.dispatch({
      gamejs: {
         type: gamejs.network.events.CLIENT_READY,
         gameId: gameId,
      }
   });
   return;
};

var NetworkController = exports.NetworkController = function(wsUrl, eventHandler) {
   var self = this;
   var gameId = null;
   var playerId = null;
   
   this.dispatch = function(event) {
      event.gamejs = event.gamejs || {}
      event.gamejs.gameId = event.gamejs.gameId || gameId;
      event.gamejs.playerId = playerId;
      ws.send(JSON.stringify(event))
      return;
   };
   /**
    * consructor
    */
   var ws = new WebSocket(wsUrl);
   ws.onopen = function() {
      gamejs.log('Connected to server');
   }
   ws.onclose = function() {
      gamejs.log('Connection to server lost');
   }
   ws.onerror = function() {
      gamejs.log('websocket error');
   }
   ws.onmessage = function(e) {
      var data = JSON.parse(e.data);
      if (data.gamejs.type === gamejs.network.events.SERVER_WELCOME) {
         playerId = data.gamejs.playerId;
         gameId = data.gamejs.gameId;
      }
      eventHandler.dispatch(data, self);
   }
   
   eventHandler.register(this);
   return this;
};

exports.EventHandler = function EventHandler() {
   var registered = [];
   
   this.register = function(obj) {
      registered.push(obj);
   }
   this.dispatch = function(event, sender) {
      registered.forEach(function(obj) {
         if (!sender || sender !== obj) {
            obj.dispatch(event);
         }
      });
   };
   return this;
};

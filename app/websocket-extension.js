/*
* A simple ringo websocket extension. Add the following code to your webapp's
* config.js file to enable it:
*
* exports.extensions = ["websocket-extension"];
*/

var websocket = require("ringo/webapp/websocket");
var log = require('ringo/logging').getLogger('WC.SOCKET');
var networkController;

exports.serverStarted = function(server) {
   var context = server.getDefaultContext();
   
   // game socket
   networkController = new NetworkController();
   websocket.addWebSocket(context, "/game", function (socket) {
      var playerId = [(new Date()).getTime(), Math.round(Math.random() * 10e4)].join('');
      socket.onmessage = function(m) {
         var msg = JSON.parse(m);
         log.info('Received', m, 'from Player#');
         if (!msg.player && msg.type == 'hello') {
            networkController.addPlayer(playerId, socket);
            socket.send(JSON.stringify({type: 'yourid', id: playerId}));
         } else {
            networkController.send(msg);
         }
         return;
      };
      
      socket.onclose = function() {
         networkController.removePlayer(playerId);
      };
   });
};

/**
 * Net controller - also our game model, all in one.
 */
function NetworkController() {
   this.sockets = {};
   return this;
};

NetworkController.prototype.addPlayer = function(id, socket) {
   log.info('connected player', id);
   // info new player about other players
   for (var playerId in this.sockets) {
      log.info('Informing connected player about {} @ {}', playerId, this.sockets[playerId].pos);
      socket.send(JSON.stringify({
         type: 'spawn',
         player: playerId,
         pos: this.sockets[playerId].pos,
      }));
   }
   // add new player to sockets
   this.sockets[id] = socket;   
   // inform all other players about new player
   var newPlayerSpawnEvent = {
      type: 'spawn',
      player: id,
      pos: [Math.random() * 400,Math.random() * 400],
   };
   this.send(newPlayerSpawnEvent, id);
   //.. and myself about my spawn (send doesn't reach me)
   socket.send(JSON.stringify(newPlayerSpawnEvent));
   return;
}

NetworkController.prototype.removePlayer = function(id) {
   log.info('dropped player', id);
   this.send({
      type: 'die',
      player: id,
   });
   delete this.sockets[id];
   return;
}

NetworkController.prototype.send = function(event) {
   this.sockets[event.player].pos = event.pos;
   var strEvent = JSON.stringify(event);
   log.info('sending ' + strEvent + ' for #' + event.player);
   for (var playerId in this.sockets) {
      if (event.player !== playerId) {
         this.sockets[playerId].send(strEvent);
      }
   };
   return;
};

exports.send = function() {
   networkController.send.apply(networkController, arguments);
   return;
};

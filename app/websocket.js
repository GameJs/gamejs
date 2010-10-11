var websocket = require("ringo/webapp/websocket");
var log = require('ringo/logging').getLogger('WC.SOCKET');
var gserver = require('gamejs/network/server');
var events = require('gamejs/network/events');

/**
 * all players connected to the gamejs server.
 */
var globalPlayers = {};

// FIXME auto create those in config
var networkControllers = {
   'example-network': 
      new gserver.NetworkController('example-network', require('gamejs/network/server').Game)
};

exports.serverStarted = function(server) {
   var context = server.getDefaultContext();
   
   // game socket
   websocket.addWebSocket(context, "/game", function (socket) {
      var playerId = [(new Date()).getTime(), Math.round(Math.random() * 10e4)].join('');
      socket.onmessage = function(m) {
         var msg = JSON.parse(m);
         log.info('Received', m, 'from Player#');
         var appId = msg.appId;
         var playerId = msg.playerId;
         if (msg.type === events.PLAYER_CREATE) {
            var player = new gserver.Player(socket, msg.name);
            globalPlayers[player.id] = player;
            player.send({
               type: events.GAME_PLAYER_CREATED,
               playerId: player.id,
            });
            log.info('created player #', player.id);
            // BAIL OUT
            return;
         } else if (!networkControllers[appId]) {
            log.info('missing or invalid appId id #', appId);
         } else if (!globalPlayers[playerId]) {
            log.info('missing or invalid player id #', playerId);
         }
         networkControllers[appId].dispatch(msg, globalPlayers[playerId]);
         return;
      };
      
      socket.onclose = function() {
         // FIXME drop player when socket closes or after
         // a certain timeout
         // networkController.removePlayer(playerId);
      };
   });
};


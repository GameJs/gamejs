var websocket = require("ringo/webapp/websocket");
var log = require('ringo/logging').getLogger('WC.SOCKET');

var gamejs = require('gamejs');
var gserver = require('gamejs/network/server');
var config = require('./config');
/**
 * all players connected to the gamejs server.
 */
var globalPlayers = {};

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
         if (msg.type === gamejs.event.NET_CLIENT_HELLO) {
            var player = new gserver.Player(socket, msg.name);
            globalPlayers[player.id] = player;
            player.send({
               type: gamejs.event.NET_SERVER_HELLO,
               playerId: player.id,
            });
            log.info('created player #', player.id);
            // BAIL OUT
            return;
         } else if (!config.networkControllers[appId]) {
            log.info('missing or invalid appId id #', appId);
         } else if (!globalPlayers[playerId]) {
            log.info('missing or invalid player id #', playerId);
         }
         config.networkControllers[appId].dispatch(msg, globalPlayers[playerId]);
         return;
      };
      
      socket.onclose = function() {
         // FIXME drop player when socket closes or after
         // a certain timeout
         // networkController.removePlayer(playerId);
      };
   });
};


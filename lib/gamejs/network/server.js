/**
 * @fileOverview Networking functionality for the serverside. **Alpha - not event everything implemented**
 *
 */
var gamejs = require('gamejs');
var arrays = require('gamejs/utils/arrays');
var log = require('ringo/logging').getLogger(module.id);

/**
 * The Player object as used on the serverside.
 */
var Player = exports.Player = function(socket, name) {
   /**
    * Is the player ready for starting the game.
    */
   this.isReady = false;
   // FIXME
   /**
    * secret id of this player
    */
   this.id = parseInt(Math.random() * 99999, 10);
   /**
    * public name of the player
    */
   this.name = name || 'new player #' + this.id;


   /**
    * Send an event to this player.
    */
   this.send = function(event) {
      var strEvent = JSON.stringify(event);
      socket.send(strEvent);
   };
   /**
    * Serialize the player for JSON transport.
    */
   this.serialize = function() {
      return {
         id: this.id,
         isReady: this.isReady,
         name: this.name,
      }
   };
   return this;
};

/**
 * If a clientside game want to connect to the server a serverside
 * NetworkController must be instantiated for that game. The NetworkController
 * provides lobby support and dispatches events to the appropriate games
 * as well as creating those games.
 *
 * @param {String} appId appId appId for which this network controller works
 * @param {String} gameClass instantiable class of the game, must have {gamejs.network.Game} interface
 * @constructor
 */
var NetworkController = exports.NetworkController = function(id, gameClass) {
   var games = {};
   
   /**
    * Act on lobby requests, forward to gamejs.dispatch if appropriate.
    * @ignore
    */
   this.dispatch = function(event, player) {
      if (event.type == gamejs.event.NET_CLIENT_CREATE_GAME) {
         var game = new gameClass();
         games[game.id] = game;
         log.info('creating game #', id);
         player.send({
            type: gamejs.event.NET_SERVER_CREATED_GAME,
            gameId: game.id,
         });
         // BAIL OUT
         return;
      // LIST GAMES
      } else if (event.type === gamejs.event.NET_CLIENT_GAMELIST) {
         log.info('listing games for #', player && player.id);
         var gameIds = Object.keys(games);
         player.send({
            type: gamejs.event.NET_SERVER_GAMELIST,
            games: [game.serialize() for each (game in games)],
         });
         // BAIL OUT
         return;
      }
      if (!games[event.gameId]) {
         log.error('missing or invalid game id #', gameId);
         // BAIL OUT
         return;
      }
      
      var gameId = event.gameId;
      // GAME_CUSTOM_EVENT -> dispatch to game
      if (event.type === gamejs.event.NET_CLIENT_CUSTOM) {
         log.info('dispatching to game #', gameId);
         games[gameId].dispatch(event);
      // JOIN
      } else if (event.type === gamejs.event.NET_CLIENT_JOIN) {
         log.info('player joined #', player.id);
         // don't join twice
         var notInPlayers = games[gameId].players.every(function(p) {
            return p.id !== player.id;
         });
         // leave other game if already joined
         for (var key in games) {
            var playerNotInGame = games[key].players.every(function(p) {
               return p.id !== player.id;
            });
            // leave if in game
            if (!playerNotInGame) {
               this.dispatch({
                  type: gamejs.event.NET_CLIENT_LEAVE,
                  gameId: key,
               }, player);
            }
         }
         if (notInPlayers) {
            games[gameId].players.push(player);
            games[gameId].dispatch({
               type: gamejs.event.NET_SERVER_JOINED,
               player: player.serialize(),
               gameId: gameId,
            });
         }
      // LEAVE
      } else if (event.type === gamejs.event.NET_CLIENT_LEAVE) {
         log.info('player left #', player.id);
         arrays.remove(player, games[gameId].players);
         games[gameId].dispatch({
            type: gamejs.event.NET_SERVER_LEFT,
            player: player.serialize(),
            gameId: gameId,               
         });
     }
   };

   return this;
}

/**
 * Default implementation for a serverside game. Holds list of players
 * and recieves every event for that game through dispatch()
 */
var Game = exports.Game = function(id) {
   /**
    * List of players currently connected to that game.
    * @type {Player}
    */
   this.players = [];
   /**
    * Id of this game
    */
   // FIXME
   this.id = parseInt(Math.random() * 9999, 10);
   return this;
};

/**
 * Overwrite this to handle the events yourself. The default implementation
 * forwards all events to the connected players.
 */
Game.prototype.dispatch = function(event) {
   // default impl just forwards to all players
   this.players.forEach(function(player) {
      player.send(event);
   }, this);
};

/**
 * Serialize game information for JSON transport. If overwritten must contain
 * `id` an `players` attributes.
 */
Game.prototype.serialize = function() {
   return {
      id: this.id,
      players: [p.serialize() for each (p in this.players)],
   }
};

var events = require('gamejs/network/events');

var EventHandler = exports.EventHandler = function() {
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

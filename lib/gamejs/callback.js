/**
 * Manage a callback with scope
 */

var Callback = exports.Callback = function(fn, scope) {
	this.fn = fn;
	this.fnScope = scope || {};
	return this;
}

Callback.prototype.trigger = function() {
	this.fn.apply(this.fnScope, arguments);
}
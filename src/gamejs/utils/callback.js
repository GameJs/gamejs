/**
 * @fileoverview
 * Manage a callback with invocation scope. This is used internally by GameJs but might be useful for others.
 */

/**
 * @param {Function} callback
 * @param {Object} scope with which the callback will be triggered
 */
var Callback = exports.Callback = function(fn, scope) {
	this.fn = fn;
	this.fnScope = scope || {};
	return this;
};
/**
 * Any arguments passed to `trigger` will be passed to the callback.
 */
Callback.prototype.trigger = function() {
	this.fn.apply(this.fnScope, arguments);
};
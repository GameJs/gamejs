QUnit.extend( QUnit, {
	pixelEqual: function(actual, pos, rgba, message) {
		actual = Array.prototype.slice.apply(actual._canvas.getContext('2d').getImageData(pos[0], pos[1], 1, 1).data);
		var expected = [rgba[0], rgba[1], rgba[2], (rgba[3] === undefined ? 255 : rgba[3])];
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	},
	surfaceEqual: function(actual, expected, message) {
      QUnit.push(actual._canvas.toDataURL() === expected._canvas.toDataURL(), actual, expected, message);
	}
});

QUnit.extend( QUnit, {
	pixelEqual: function(actual, pos, rgba, message) {
		actual = Array.prototype.slice.apply(actual._canvas.getContext('2d').getImageData(pos[0], pos[1], 1, 1).data);
		var expected = [rgba[0], rgba[1], rgba[2], (rgba[3] === undefined ? 255 : rgba[3])];
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	},
	surfaceEqual: function(actual, expected, message) {
	   var expectedString = typeof expected === 'string' ? expected : expected._canvas.toDataURL();
	   var actualString = typeof actual === 'string'  ? actual : actual._canvas.toDataURL();
      QUnit.push(actualString === expectedString, actualString, expectedString, message);
	}
});

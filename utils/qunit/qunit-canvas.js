QUnit.extend( QUnit, {
	pixelEqual: function(actual, pos, rgba, message) {
		actual = Array.prototype.slice.apply(actual._canvas.getContext('2d').getImageData(pos[0], pos[1], 1, 1).data);
		var expected = [rgba[0], rgba[1], rgba[2], (rgba[3] === undefined ? 255 : rgba[3])];
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	},
	surfaceEqual: function(actual, expected, message) {
	   var expectedString = typeof expected === 'string' ? expected : expected._canvas.toDataURL();
	   var actualString = typeof actual === 'string'  ? actual : actual._canvas.toDataURL();

	   var testCanvas = document.createElement('canvas');
	   var eImg = document.createElement('img');
	   eImg.setAttribute('src', expectedString);
	   var aImg = document.createElement('img');
	   aImg.setAttribute('src', actualString);

      var w = Math.max(aImg.width, eImg.width);
      var h = Math.max(eImg.height, eImg.height);
	   testCanvas.setAttribute('width', w + 'px');
	   testCanvas.setAttribute('height', h + 'px');

      var ctx = testCanvas.getContext('2d');
      ctx.drawImage(eImg, 0,0);
      ctx.globalCompositeOperation = 'xor';
      ctx.drawImage(aImg, 0, 0);
      //document.body.appendChild(testCanvas);
      // count non transparent pixels
      var imgData = ctx.getImageData(0,0,w-1,h-1);
      var nonTransparent = 0;
      var count = imgData.data.length;
      for (var i=0;i<count-1;i+=4) {
         if (imgData.data[i+3] !== 0) {
            nonTransparent++;
         }
      }
      var ratio = nonTransparent / count;
      QUnit.push(ratio < 0.08, actualString, expectedString, message);
	}
});

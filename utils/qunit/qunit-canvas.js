QUnit.extend( QUnit, {
	pixelEqual: function(actual, pos, rgba, message) {
		actual = Array.prototype.slice.apply(actual._canvas.getContext('2d').getImageData(pos[0], pos[1], 1, 1).data);
		var expected = [rgba[0], rgba[1], rgba[2], (rgba[3] === undefined ? 255 : rgba[3])];
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	},
	surfaceEqual: function(actual, expected, message, callback) {
      if (typeof(message) === 'function') {
         callback = message;
         message = "";
      }
	   var expectedString = typeof expected === 'string' ? expected : expected._canvas.toDataURL();
	   var actualString = typeof actual === 'string'  ? actual : actual._canvas.toDataURL();

      var loadCount = 0;
      var increaseLoaded = function() {
         loadCount++;
         if (loadCount == 2) {
            execComparision();
         }
      }
	   var testCanvas = document.createElement('canvas');
	   var eImg = document.createElement('img');

      eImg.onload = increaseLoaded;
	   eImg.src = expectedString;
	   var aImg = document.createElement('img');
      aImg.onload = increaseLoaded;
	   aImg.src = actualString;
      var execComparision = function() {
         var w = Math.max(aImg.naturalWidth, eImg.naturalWidth);
         var h = Math.max(eImg.naturalHeight, eImg.naturalHeight);
   	   testCanvas.width = w; //setAttribute('width', w + 'px');
   	   testCanvas.height = h; //setAttribute('height', h + 'px');

         var ctx = testCanvas.getContext('2d');
         ctx.drawImage(eImg, 0, 0);
         ctx.globalCompositeOperation = 'xor';
         ctx.drawImage(aImg, 0, 0);
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
         /*console.log('ratio is', ratio, count, w, h)
         document.body.appendChild(testCanvas);
         document.body.appendChild(eImg);
         document.body.appendChild(aImg);
         */
         QUnit.push(ratio < 0.08, actualString, expectedString, message);
         if (callback) {
            callback();
         }
      }
	}
});

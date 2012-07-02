var base64 = require('gamejs/base64');

var data = {
    "pleasure": ["cGxlYXN1cmU=", [166, 87, 154, 178, 234, 222]],
    "leasure": ["bGVhc3VyZQ==", [149, 230, 172, 186, 183, 128]],
    "easure": ["ZWFzdXJl", [121, 171, 46, 173, 224, 0]],
    "asure": ["YXN1cmU=", [106, 203, 171, 120, 0, 0]],
    "sure": ["c3VyZQ==", [178, 234, 222]]
};

test('decode', function() {
   for (var key in data) {
      var result = data[key];
      strictEqual(base64.decode(result[0]), key);
      deepEqual(base64.decodeAsArray(key), result[1]);
   }

});

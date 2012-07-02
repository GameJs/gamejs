var xml = require('gamejs/xml');

qModule('gamejs/xml');

var props = ['topleft', 'bottomright'];
var testXml = '<?xml version="1.0" encoding="UTF-8"?>\
<gamejs desc="html canvas library">\
  <class name="Rect">\
    <classprop>topleft</classprop>\
    <classprop>bottomright</classprop>\
  </class>\
  <class>\
    Sprite\
  </class>\
</gamejs>';

test('fromString', function() {
   var doc = xml.Document.fromString(testXml);
   equal(doc.elements('class').length, 2);
   equal(doc.elements('gamejs').length, 1);
   equal(doc.elements('gamejs')[0].attribute('desc'), 'html canvas library');
   doc.elements('classprop').forEach(function(classDoc, idx) {
      var value = classDoc.children()[0].value();
      equals(value, props[idx]);
   });
});

// FIXME Document.fromURL() unit test

var gamejs = require('gamejs');
qModule('gamejs/audio');
var surfaceEqual = QUnit.surfaceEqual;

var audio = null;
QUnit.testStart(function() {
   audio = new gamejs.audio.Sound(document.getElementById('sound-fixture'));
})

// this should just run through
QUnit.test('basic', 0, function() {
   audio.play();
   audio.stop();
   audio.play();
   audio.pause();
});

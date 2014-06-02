var gamejs = require('gamejs');

gamejs.preload([]);

gamejs.ready(function() {

    var display = gamejs.display.getSurface();
    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render('Hello World')
    );

    gamejs.event.onEvent(function(event) {
        // event handling
    });
    // there are also more special functions
    // gamejs.event.onKeyUp, gamejs.event.onMouseMotion,...

    gamejs.onTick(function(msDuration) {
        // game loop
    });
});

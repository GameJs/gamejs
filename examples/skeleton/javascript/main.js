var gamejs = require('gamejs');

// gamejs.preload([]);

gamejs.ready(function() {

    var display = gamejs.display.setMode([600, 400]);
    display.blit(
        (new gamejs.font.Font('30px Sans-serif')).render('Hello World')
    );

    /**
    function tick(msDuration) {
        // game loop
        return;
    };
    gamejs.time.fpsCallback(tick, this, 60);
    **/
});

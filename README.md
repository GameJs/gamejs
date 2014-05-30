GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas <http://gamejs.org>.

Game showcase: <http://gamejs.org/showcase.html>

Topics
========

## Drawing on the screen

 * gamejs.display
 * gamejs.image
 * gamejs.graphics
 * gamejs.font

## Mouse and keyboard

 * gamejs.event

## Audio

 * gamejs.audio

### Kickstarting your game

 * gamejs.ready()
 * gamejs.preload()
 * gamejs.onTick()

# Game logic

 * gamejs.animate
 * gamejs.tiledmap
 * gamejs.pathfinding
 * gamejs.collisionmask

## Advanced

 * gamejs.thread
 * gamejs.math.noise

# Generally useful

 * gamejs.http
 * gamejs.math.*
 * gamejs.utils.*




Usage
=================

### Standalone

Load the `gamejs.min.js` file and tell the module loader where your
"main" module lies (usually "./javascript/main.js"):

    <script src="./public/gamejs.min.js"></script>
    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>


And inside "./javascript/main.js", you can `require` gamejs
and start your game:

    var gamejs = require('gamejs');
    gamejs.ready(function() {
       var display = gamejs.display.setMode([600, 400]);
       display.blit(myImage);
       ....
    });

### RequireJs/Browserify

GameJs is a CommonJs package published on NPM. You need to install the GameJs package:

    $ npm install gamejs

And something to run your modules in the browser, for example browserify:

    $ npm install -g browserify

Point browserify to your main module and produce a bundled JS file including GameJs and any other packages you use in your game:

    $ browserify ./main.js --out bundled.js

More Help
===========

See the [GameJs Website](http://gamejs.org) for more help or drop us
an email in the [Mailing List](http://groups.google.com/group/gamejs).

Example application can be found in the `examples/` directory.

Development - How to build
===================

GameJs consists of CommonJs modules in `./src/` which we build and jshint with grunt. If you don't already have node and npm, install those. You will also need `java` on your path for building the CommonJs files.

Install then grunt commandline interface:

    $ npm install -g grunt-cli


In the GameJs folder you cloned, install the dependencies to build using npm:

    $ npm install

Build GameJs:

    $ grunt

This will create the `gamejs-VERSION.js` file and a minified `gamejs-VERSION.min.js` which you can use standalone in the browser, as demonstrated in the examples.


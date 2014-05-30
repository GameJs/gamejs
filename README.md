GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas.

Homepage: <http://gamejs.org>.

Topics
========

### Drawing on the screen

 * [gamejs.image](http://docs.gamejs.org/gamejs/image/) loading image files
 * [gamejs.graphics](http://docs.gamejs.org/gamejs/graphics/) image transformation (rotate, transform,...) and drawing with geometric shapes
 * [gamejs.font](http://docs.gamejs.org/gamejs/font/) rendering text

### Mouse and keyboard

 * [gamejs.event](http://docs.gamejs.org/gamejs/event/) Recieve events for user input

### Audio

 * [gamejs.audio](http://docs.gamejs.org/gamejs/audio/) Playback with multiple channels

### Game logic

 * [animate](http://docs.gamejs.org/gamejs/animate/) Spritesheets and animations
 * [tiledmap](http://docs.gamejs.org/gamejs/tiledmap/) Load maps created with the [Tiled](http://www.mapeditor.org/) map editor
 * [pathfinding](http://docs.gamejs.org/gamejs/pathfinding/) A* Pathfinding
 * [pixelcollision](http://docs.gamejs.org/gamejs/pixelcollision) Pixel perfect collision detection

### Advanced

 * [thread](http://docs.gamejs.org/gamejs/thread/) utilize WebWorkers
 * [math/noise](http://docs.gamejs.org/gamejs/math/noise/) random noise generator

### Math

 * [math/vectors](http://localhost/gamejs/doc/api/gamejs/math/vectors/)
 * [math/matrix](http://localhost/gamejs/doc/api/gamejs/math/matrix/)
 * [math/random](http://localhost/gamejs/doc/api/gamejs/math/random/) random numbers and vectors


Usage
=================

## Standalone

Load the "gamejs.min.js" script and tell the module loader where your
game's main module lies (usually "./javascript/main.js"):

    <script src="./public/gamejs.min.js"></script>
    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>


And inside "./javascript/main.js", you can `require` gamejs
and start your game:

    var gamejs = require('gamejs');
    gamejs.ready(function() {
        ...
    });

## GameJs a node package with browserify

GameJs is a CommonJs package published on NPM. To use it with [browserify](http://browserify.org/) install GameJs in your game's directory:

    $ npm install gamejs

And install browserify, if you don't already have it.

    $ npm install -g browserify

You can then bundle your application ("main.js") with all its dependencies - including GameJs - like so:

    $ browserify ./main.js --out bundled.js

More Help
===========

See the [GameJs Website](http://gamejs.org) for more help or drop us
an email in the [Mailing List](http://groups.google.com/group/gamejs).

Example application can be found in the `examples/` directory.

Development - How to build
===================

GameJs consists of CommonJs modules in `./src/` which we build and jshint with grunt. If you don't already have node and npm, install those. You will also need `java` on your path for building the distribution file.

Install then grunt commandline interface:

    $ npm install -g grunt-cli


In the GameJs folder you cloned, install the dependencies to build using npm:

    $ npm install

Build GameJs:

    $ grunt

This will create the `gamejs-VERSION.js` file and a minified `gamejs-VERSION.min.js` which you can use standalone in the browser, as demonstrated in the examples.


GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas.

  * Homepage: <http://gamejs.org>.
  * [Showcase of games built with Gamejs](http://gamejs.org/showcase.html)

Topics
========

### Drawing on the screen

 * [image](http://docs.gamejs.org/gamejs/image/) loading image files
 * [graphics](http://docs.gamejs.org/gamejs/graphics/) image transformation (rotate, transform,...) and drawing with geometric shapes
 * [font](http://docs.gamejs.org/gamejs/font/) rendering text

### Mouse and keyboard

 * [event](http://docs.gamejs.org/gamejs/event/) Recieve events for user input

### Audio

 * [audio](http://docs.gamejs.org/gamejs/audio/) Playback with multiple channels

### Game logic

 * [animate](http://docs.gamejs.org/gamejs/animate/) Spritesheets and animations
 * [tiledmap](http://docs.gamejs.org/gamejs/tiledmap/) Load maps created with the [Tiled](http://www.mapeditor.org/) map editor
 * [pathfinding](http://docs.gamejs.org/gamejs/pathfinding/) A* Pathfinding
 * [pixelcollision](http://docs.gamejs.org/gamejs/pixelcollision) Pixel perfect collision detection

### Advanced

 * [thread](http://docs.gamejs.org/gamejs/thread/) utilize WebWorkers
 * [math/noise](http://docs.gamejs.org/gamejs/math/noise/) random noise generator

### Math

 * [math/vectors](http://docs.gamejs.org/gamejs/math/vectors/)
 * [math/matrix](http://docs.gamejs.org/gamejs/math/matrix/)
 * [math/random](http://docs.gamejs.org/gamejs/math/random/)


Usage
=================

See the [examples](./examples/) directory for working examples.

## Standalone

HTML File loads GameJs and sets the main module:

    <script src="./public/gamejs.min.js"></script>
    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>


The main module `javascript/main.js` starts the application:

    var gamejs = require('gamejs');
    gamejs.ready(function() {
        var display = gamejs.display.getSurface();
        ...
    });

## GameJs as a CommonJs package with browserify

GameJs is a CommonJs package published on NPM. To use it with [browserify](http://browserify.org/) install the GameJs package in your game's directory:

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


GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas <http://gamejs.org>.

Usage
=========

Depending on how you got GameJs:

## Option 1: zip release

Extract the zip file and try the examples in the zip file over http://.

## Option 2: Node package registry

After you installed gamejs, you can use a bundler like `browserify` 
to run your code on the client. Here's a small example:

    cd ~/my-web-game/
    npm install gamejs
    npm install -g browswerify
    browserify ./main.js --out bundled.js

## Option 3: using the git version

You will have to build GameJs. Go to the GameJs directory and execute this 
in a unix shell, cygwin or in `git bash`:

    $ ./bin/build.sh

This should create the `gamejs.min.js` file in the GameJs home directory.

Minimal example
=================

Load the `gamejs.min.js` file tell the module loader where your
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

More Help
===========

See the [GameJs Website](http://gamejs.org) for more help or drop us
an email in the [Mailing List](http://groups.google.com/group/gamejs).

Check the `docs` folder of your GameJs installation.

Example application can be found in the `examples/` directory.

Bundle your application for production
==========================================================

A bundled game:

  * does not need to be served over http:// (unless it uses `SurfaceArray`)
  * has a smaller file size
  * has somewhat obfuscated code

To bundle all JavaScript files into one single file, use:

    $./bin/minify-app.sh ./path-to-your-app/javascript/

You can also add a second argument `compress`. With `compress`, the resulting
bundle file will be compressed for smaller file size as well as obfuscated.

`minify-app.sh` will create the bundled file `app.min.js` in your app's
`javascript` folder.

With browserify
----------------

If you already have nodejs installed, this might be convinient:

   npm install -g browserify
   npm install gamejs


GameJs Contribution
===================

Don't forget to `./bin/build.sh` when modifying the source.

All applications use a bundled JavaScript file which contains all the 
GameJs source files; thus if you modify the files below `./lib` your 
changes won't show up in the examples unless you re-build the source files 
with the `./bin/build.sh` command.

Unit Tests
--------------

We use QUnit <https://github.com/jquery/qunit> for the GameJs unit tests. Execute
the tests by opening `tests/index.html`.

JsDoc
----------
For the JavaScript documentation system, RingoJs must be installed on your system.

    $ ./bin/create-jsdoc.sh


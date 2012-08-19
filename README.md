GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas <http://gamejs.org>.

Usage
=========

## Option 1: If you downloaded a release

Try the examples in the zip file over http://

## Option 2: If you downloaded the git version

You will have to build GameJs. Go to the GameJs directory and execute this 
in a unix shell, cygwin or in `git bash`:

    $ ./bin/build.sh

This should create a `gamejs.min.js` file in the GameJs home directory.

See the `examples/skeleton/` directory for a minimal GameJs app. We recommend
you also use this as the scaffolding if you want to create a new game yourself.

http:// vs file://
----------------------

Note that you need to run the examples via `http://` (not `file://`)
unless you use Firefox or Safari. One trivial, cross-plattform solution to serve
a directory via http is this executable: <http://code.google.com/p/mongoose/>.

Bundled applications don't have the http:// requirement - see below.

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

To use the bundled file add a `<script>` tag loading it and remove all
other `<script>`s.

More Help
===========

See the [GameJs Website](http://gamejs.org) for more help or drop us
an email in the [Mailing List](http://groups.google.com/group/gamejs).

Check the `docs` folder of your GameJs installation.

Example application can be found in the `examples/` directory.

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

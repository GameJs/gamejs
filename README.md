GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas <http://gamejs.org>.

Its API is modeled after the successful PyGame library <http://pygame.org>.

  * <http://gamejs.org>
  * <http://gamejs.org/docs/>
  * <http://gamejs.org/showcase/>

Usage
=========

See the `examples/skeleton/` directory for a minimal GameJs app. We recommend
you also use this as the scaffolding if you want to create a new game yourself.

**Note** that you need to run the examples via `http://` (not `file://`)
unless you use Firefox or Safari. One trivial, cross-plattform solution to serve
a directory via http is this executable: <http://code.google.com/p/mongoose/>.

Bundle your application for production
======================================

To wrap your own game's JavaScript files into one single file, use
`./wrap-directory ./path-to-your-app/javascript/`. You can also add a second argument
`compress` to optionally minify the resulting JS file.

This will produce one file `gjs-app-wrapped.js` holding all GameJs modules as
well as your application code. You can then remove the `<script>` lines loading
yabble & gamejs-wrapped and instead load this big file.

More Help
===========

See the [GameJs Website](http://gamejs.org) for more help or drop us
an email in the [Mailing List](http://groups.google.com/group/gamejs).

Check the `docs` folder of your GameJs installation.

Example application can be found in the `examples/` directory.

GameJs Development
=====================================

In production, an application uses a bundled JavaScript file which contains all
GameJs modules (usually called `gamejs-wrapped.js`). This is what all the examples
do.

Thus if you modify the files below `./lib` your changes won't show up in the
examples. You have two options to hack on GameJs:

  * rebundle the files with the `./wrap-gamejs.sh` command
  * directly use the unbundled library files

To use the unbundled JavaScript files directly, remove the `<script>` line including
`gamejs-wrapped.js` from your `index.html` and instead create symbolic links of
everything below `./lib` into your applications `javascript/` directory:

    $ cd path-to-your-app/javascript/
    $ ln -s ~/gamejs/lib/*

Your application should now transparently load the single modules instead of the
bundle.

For the following features, RingoJs must be installed on your system:

   $ ./create-jsdoc.sh     # render the API to the folder docs/api
   $ ./run-unit-tests.sh   # run the GameJs unit tests

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

See `examples/skeleton/` directory for a minimal GameJs app.

**Note** that you need to run the examples via `http://` (not `file://`)
unless you use Firefox or Safari.

GameJs Development
=====================================

One trivial, cross-plattform solution to serve a directory via http
is this executable: <http://code.google.com/p/mongoose/>.

Instead of using the `gamejs-wrapped.js` file you can also put all the
GameJs files (everything below `./lib`) into the JavaScript directory of
your application. Your code should then transparently use those files.

Run GameJs unit tests, require RingoJs:

    $ ringo test/all.js

More Help
===========

Check the `docs` folder of your GameJs installation.

Example application can be found in the `examples/` directory.

See the [GameJs Website](http://gamejs.org) for more help or drop us
an email in the [Mailing List](http://groups.google.com/group/gamejs).

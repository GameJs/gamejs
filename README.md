GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive
graphic applications for the HTML Canvas <http://gamejs.org>.

Its API is modeled after the successful PyGame library <http://pygame.org>.

<http://gamejs.org> -- <http://gamejs.org/docs/> -- <http://gamejs.org/showcase/>

Usage
=========

See `examples/skeleton/` directory for a minimal GameJs app.

GameJs Development
=====================================

If you use the git version of GameJs or made modification to the GameJs
source files in the `lib/` directory you might want to know how to
build the `gamejs-wrapped.js` file, which is used by all games.

Building gamejs-wrapped.js
----------------------------

Use `create-wrapped.sh` to update the `examples/skeleton/public/gamejs-wrapped.js`
file. This command uses Yabbler to convert the GameJs commonjs modules into a format
usable in browsers.

    FIXME
      create-wrapped.sh
         1) generalize so app developers can use it to wrap their code
         1) explain require.useScriptTags() and the require.setModuleRoot('./dist/')
         1) build in minification https://github.com/douglascrockford/JSMin

Run unit tests, require RingoJs:

    $ ringo test/all.js

More Help
===========

Check the `docs` folder of your GameJs installation.

Example application can be found in the `examples/` directory.

See the [GameJs Website](http://gamejs.org) for more help or drop us an email in the [Mailing List](http://groups.google.com/group/gamejs).

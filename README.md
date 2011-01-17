GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas. Its API is modeled after the successful PyGame <http://pygame.org> library.

  * Powerful, proven, and thin abstraction for 2D
  * Sane JavaScript! With CommonJs support
  * Runs in modern browsers

The API will change though it will converge to a sensible translation of PyGame concepts to JavaScript.

Install
========

Option 1: The Good Way
-------------------------
Use the RingoJs server. This allows you to write your game as CommonJs modules <http://wiki.commonjs.org/wiki/Modules> (1.1) in a convinient way. You can also use the evolving server-side integration.

You need:

  * Java 1.5+.
  * git and ant (until I do a proper release)

Clone the GameJs repository:

    git clone git://github.com/oberhamsi/gamejs.git

Get all needed submodules with git:

    cd gamejs
    git submodule init
    git submodule update

Compile RingoJs. This is why you need ant & java:

    ant -f gamejs/app/ringojs/build.xml jar

Option 2: The quick and dirty <script> way
---------------------------------------------
No module support for you game. But no need to run JVM during development either. This is only for the lazy and stupid to use. Don't expect much help.

Download the gjs-retarded-<version>.js file and include it in your html file:

    <script src="./gjs-retarded-<version>.js"></script>
    <script>
        var gamejs = require('gamejs');

        gamejs.preload(['images/foo.png', ...]);

        gamejs.ready(function() {
           var display = gamejs.display.setMode([800, 600]);
           gamejs.draw.circle(display, 'rgba(100, 100, 100, 0.4)', [50, 50], 20);

           //var objects = gamejs.utils.objects;
           //...
           //extend(MyMonster, gamejs.sprite.Sprite);

           //gamejs.sprite.collideRect(...
        });
    </script>

Usage
=========

Start the GameJs web server with `gjs-server.sh` or `gjs-server.cmd` (Windows). And view the dashboard it in your browser:

    http://localhost:8080/

Several links to the example apps should show up. The source to those apps is in the `apps/` directory of your GameJs installation.

More Help
===========

Check the `docs` folder of your GameJs installation.

A couple of example apps can be found in the `apps` directory.

See the [GameJs Website](http://gamejs.org) for more help or drop us an email in the [Mailing List](http://groups.google.com/group/gamejs).

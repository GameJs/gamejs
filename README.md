GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas. Its API is modeled after the successful PyGame <http://pygame.org> library.

  * Powerful, proven, and thin abstraction for 2D
  * Sane JavaScript! With CommonJs support
  * Runs in modern browsers
  * optional server-side integration with RingoJs <http://ringojs.org>

The API will change though it will converge to a sensible translation of PyGame concepts to JavaScript.

Install
========

If you downloaded a release just unzip the files.

Developer Version
----------------------------------

You need:

  * Java 1.5+
  * git and ant

Clone the GameJs repository:

    git clone git://github.com/oberhamsi/gamejs.git

Change into the GameJs directory

    cd gamejs

Get all needed submodules with git:

    git submodule init
    git submodule update

Compile RingoJs:

    ant -f ./server/ringojs/build.xml jar

You should now be able to start the GameJs server.

Usage
=========

You need Java 1.5+.

Start the GameJs web server with:

    gjs-server.sh   (gjs-server.cmd on Windows)

And view the dashboard in your browser:

    http://localhost:8080/

Several links to the example apps should show up. The source to those apps is in the `examples` directory of your GameJs installation.

Retarded Edition
==================

Only recommended for demonstration purposes. More infos in the help file 'docs/retarted-edition' <https://github.com/oberhamsi/gamejs/blob/master/docs/retarded-edition.md>

More Help
===========

Check the `docs` folder of your GameJs installation.

A couple of example apps can be found in the `examples` directory.

See the [GameJs Website](http://gamejs.org) for more help or drop us an email in the [Mailing List](http://groups.google.com/group/gamejs).

GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas <http://gamejs.org>. Its API is modeled after the successful PyGame library <http://pygame.org>.

GameJs comes with a development server to make it easier to write your software as CommonJs modules <http://ringojs.org/wiki/Modules_in_RingoJS>. Optionally, you can ditch the server and let a loader like Yabble deal with the CommonJs requirements <https://github.com/jbrantly/yabble>.

Install
========

If you downloaded a release just unzip the files. If you chose the git version see 'Install Developer Version'.

Usage
=========

Option 1: GameJs Dev Server
----------------------------

You need Java 1.5+

Start the GameJs web server with:

    gjs-server.sh   (gjs-server.cmd on Windows)

And view the dashboard in your browser:

    http://localhost:8080/

Several links to the example apps should show up. The source to those apps is in the `examples` directory of your GameJs installation.

Option 2: Static files
------------------------

Your `index.html` only loads `yabble.js` and calls your entry point `javascript/main.js` module:

    <script>
     // GameJs globals
     var $g = {
       resourceBaseHref: './',
       ajaxBaseHref: './json/'
     };
    </script>
    <script src="yabble/lib/yabble.js"></script>
    <script>
       require.setModuleRoot('./javascript');
       require.run('main')
    <script>

You must download the Yabble project yourself from <https://github.com/jbrantly/yabble>.

Additionally you must copy (or better: alias or symlink) all the GameJs JavaScript files from `server/packages/gamejs/lib/*` into the project's `./javascript/` directory.

API documentation
===================

<http://docs.gamejs.org/>

The API docs are created with the `ringo-doc` command. Issue this inside your GameJs installation:

    server/ringojs/bin/ringo-doc --file-urls -s ./server/packages/gamejs/lib/ -d ./docs/api/

This will write the API docs to `docs/api/`. This directory must be empty.

GameJs Dev Server - Static Deployment
=======================================

You can deploy your games as plain HTML and JavaScript, even when using the GameJs Development server with the `gjs-statify` command:

    gjs-statify.sh <app> <output-directory>

For example, to deploy one of the example apps:

    gjs-statify.sh example-draw /var/www/games/foo

More Help
===========

Check the `docs` folder of your GameJs installation.

A couple of example apps can be found in the `examples` directory.

See the [GameJs Website](http://gamejs.org) for more help or drop us an email in the [Mailing List](http://groups.google.com/group/gamejs).

Install Developer Version
============================

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

Read more in section 'Usage'.

GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas. Its API is modeled after the successful PyGame <http://pygame.org> library.

  * Powerful, proven, and thin abstraction for 2D
  * Sane JavaScript! With CommonJs support
  * Runs in modern browsers

Gamejs is early in development. The API will change though it will converge to a sensible translation of PyGame concepts to JavaScript.

Install
-------
*Windows Users*: you can try the .zip file in the Downloads section <https://github.com/oberhamsi/gamejs/archives/master>

You need:

  * Java 1.5+.
  * git and ant (until I do a proper release)

Clone the GameJs repository:

    git clone git://github.com/oberhamsi/gamejs.git

Get all needed submodules:

    cd gamejs
    git submodule init
    git submodule update

Compile RingoJs (this is why you need ant & java):

    ant -f app/ringojs/build.xml jar

Usage
------------------

Start the GameJs web server:

    ~/gamejs/start.sh

and access it in your browser:

    http://localhost:8080/

Several links to example apps should show up. The source to those apps is in the `apps/` directory of your GameJs installation.

Writing games with GameJs
-----------------------------

Check the `docs` folder of your GameJs installation.

A couple of example apps can be found in the `apps` directory.

See the [GameJs Website](http://gamejs.org) in particular the [API](http://gamejs.org/api/) for more help or drop us an email in the [Mailing List](http://groups.google.com/group/gamejs).

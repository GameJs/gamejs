GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas. Its API is modeled after the successful PyGame <http://pygame.org> library.

  * Powerful, proven, and thin abstraction for 2D
  * Sane JavaScript! With CommonJs support
  * Runs in modern browsers

Gamejs is early in development. The API will change though it will converge to a sensible translation of PyGame concepts to JavaScript.

Install
-------
GameJs is a RingoJS application. You will need:

  * Java 1.5+.
  * git and ant (until I do a proper release)

Get RingoJs:

    cd ~
    git clone git://github.com/ringo/ringojs.git
    cd ringojs
    ant jar

Install necessary RingoJs packages:

    ringo-admin install hns/ringo-modulr
    ringo-admin install ringo/stick

Get Gamejs:

    cd ~
    git clone git://github.com/oberhamsi/gamejs.git
    ln -s ~/gamejs ~/ringojs/packages/

*Windows Users:* Instead of the above Symlink you can clone GameJs directly into RingoJs.

    cd ~/ringojs/packages/
    git clone git://github.com/oberhamsi/gamejs.git

Usage
------------------

Start the GameJs web server:

    # assumes ~/ringojs/bin/ringo exists
    ~/gamejs/start.sh

and access it in your browser:

    http://localhost:8080/

Several links to example apps should show up. The source to those apps is in the `apps/` directory of your GameJs installation.

Writing games with GameJs
-----------------------------

Check the `docs` folder of your GameJs installation.

A couple of example apps can be found in the `apps` directory.

See the [GameJs Website](http://gamejs.org) in particular the [API](http://gamejs.org/api/) for more help or drop us an email in the [Mailing List](http://groups.google.com/group/gamejs).

Updating your GameJs Installation
-----------------------------------
If you update GameJs you must always update *all* its compontents.

Update RingoJs and GameJs:

    cd ~/ringojs/
    git pull
    cd ~/gamejs/
    git pull

Update RingoJs packages:

    ringo-admin install -f hns/ringo-modulr
    ringo-admin install -f ringo/stick

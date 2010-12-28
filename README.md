GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas. Its API is modeled after the successful PyGame <http://pygame.org> library.

   * Runs in modern browsers
   * Sane JavaScript! With [CommonJs](http://www.commonjs.org/) support
   * Mature, well documented PyGame API with a decade of patterns
   * Philosophy: Ease of use > Completeness

Gamejs is early in development. The API will change though it will converge to a sensible translation of PyGame concepts to JavaScript.

Install
-------
GameJs is a RingoJS application. The installation is convoluted because I
want to stay flexible for now.

Install Ringo (you need Java 1.5+):

    cd ~
    git clone git://github.com/ringo/ringojs.git
    cd ringojs
    ant jar

(more details on how to install Ringo <http://ringojs.org/getting_started>)

Install the RingoJs packages `ringo-modulr` and `stick`:

    cd ~/ringojs/packages/
    git clone git://github.com/hns/ringo-modulr.git
    git clone git://github.com/ringo/stick.git

Finally, install GameJs:

    cd ~
    git clone git://github.com/oberhamsi/gamejs.git

and symlink GameJs into RingoJs' packages directory:

    ln -s ~/gamejs /usr/share/ringojs/packages/

Try example apps
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

See the [GameJs API](http://gamejs.org/api/) as well as the [Mailing List](http://groups.google.com/group/gamejs) for more help.

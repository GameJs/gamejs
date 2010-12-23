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
GameJs is a Ringo application. Once you have Ringo installed the other components
are easy to get with Ringo's package managment.

Details on how to install Ringo: <http://ringojs.org/wiki/Getting_Started/>

Once you have Ringo get the necessary dependancies with `ringo-admin`:

    ringo-admin install hns/ringo-modulr
    ringo-admin install ringo/stick

Git clone GameJs to a convinient location:

    cd ~
    git clone git://github.com/oberhamsi/gamejs.git

Finally symlink GameJs into Ringo's packages directory:

    ln -s ~/gamejs /usr/share/ringojs/packages/

(Do not `ringo-admin install gamejs`. That would not work.)

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

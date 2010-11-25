GameJs
=======

GameJs is a JavaScript library for writing 2D games or other interactive graphic applications for the HTML Canvas. Its API is modeled after the successful PyGame <http://pygame.org>.

GameJs' killer feature will be easy networking with the possibility to share application code between the client & the server. The server part of any game is as well written in JavaScript.

Install
-------

GameJs is a Ringo application. Once you have Ringo installed the other components
are easy to get with Ringo's package managment.

Details on how to install Ringo: <http://ringojs.org/wiki/Getting_Started/>

Once you have Ringo get the necessary dependancy with `ringo-admin`:

    ringo-admin install hns/ringo-modulr

Git clone GameJs to a convinient location:

    cd ~
    git clone git://github.com/oberhamsi/gamejs.git

Finally symlink GameJs into Ringo's packages directory:

    ln -s ~/gamejs /usr/share/ringojs/packages/

Try example apps
------------------
Start the GameJs web server:

    ~/gamejs/start.sh
   
.. and access it in your browser:
   
    http://localhost:8080/

Several links to example apps should show up.

Writing games with GameJs
-----------------------------
Every GameJs app lives in its own directory below `apps/`. The web interface lists them automatically.

`main.js` in such an app directory is called by GameJs to bootstrap your game in the browser. A couple of example apps are provided to get you started.

See the [GameJs API](http://gamejs.org/api/) as well as <http://gamejs.org> for more help.

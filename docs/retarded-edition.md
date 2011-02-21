Retarded Edition
==================

The retarded edition of GameJs is a plain JavaScript file. It does not come with a development server thus you forfeit the following advantages:

  * write your code as CommonJs modules
  * easy local development with integrated http server
  * RingoJs server-side integration (gamejs.http)
  * potential future resource loader improvements

Usage
------

Include the JavaScript file like so. Remember to change the script file name `gjs-retarded-VERSION.js`:

    <script>
       if (!window.console) {
          window.console = {log: function() {}};
       }
       var $g = {};
       $g.resourceBaseHref = './';
       $g.ajaxBaseHref = './json/';
    </script>
    <script src="./gjs-retarded-VERSION.js"></script>
    <script>
       var gamejs = require('gamejs');
       gamejs.ready(function() {
          var display = gamejs.display.setMode([800, 600]);
          gamejs.draw.circle(display, 'rgba(100, 100, 100, 0.4)', [50, 50], 20);
          // .....
       });
    </script>

If you want to use images, sounds or the gamejs.http module adapt those values:

  * `$g.resourceBaseHref` is prefixed to all URLs loaded with `gamejs.preload()` or `gamejs.image.load()`
  * `$g.ajaxBaseHref` prefix for `gamejs.http.load()` calls

Building
---------

The retarded edition is the output of ringo-modulr. Issue this in your GameJs install directory (only test on Linux & Mac):

    server/ringojs/bin/ringo --packages server/packages/ ./server/packages/ringo-modulr/bin/ringo-modulr server/packages/gamejs/lib/gamejs > gjs-retarded-dev.js

and attach the following lines to the resulting file:

    window.require = function() {
       return modulr.require.apply(modulr, arguments);
    };

gjs-retarded-dev.js should now be a usuable as described above.

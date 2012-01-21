To deploy your application, we will compress and optimize all JavaScript files into one big file.

## your files

`bin/minify-app.sh` must be called with a directory holding your application's JavaScript files. It will compress the files in that directory, GameJs and Yabble into a new file `gamejs.app.min.js` in the same directory:

    $ ./bin/minify-app.sh ./examples/example-draw/javascript/
    $ ls ./examples/example-draw/javascript/
     app.min.js main.js

Enable loading of this new file, and disable the singular GameJs and Yabble files:

    <!-- <script src="../skeleton/public/yabble.js"></script> -->
    <!-- <script src="../skeleton/public/gamejs.min.js"></script> -->
    <script src="./javascript/app.min.js"></script>
    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>

Now your application should only rely on the one `app.min.js` file and *not* load any other modules via Ajax during load time. You can verify that with Firebug or Chrome.

Ship it!

## Compression

Add the second argument `compress` to have the resulting file compressed with Google closure compiler:

    $ ./bin/minify-app.sh ./examples/example-draw/javascript/ compress

This will probably throw warnings about possible problems with your code in certain browsers, but unless you get errors, you should be fine.

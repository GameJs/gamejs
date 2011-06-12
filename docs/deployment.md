To deploy your application, we will compress and optimize all JavaScript files into one big file.

## your files

`wrap-directory.sh` must be called with a directory holding your application's JavaScript files. It will compress the files in that directory, GameJs and Yabble into a new file `gjs-app-wrapped.js` in the same directory:

    $ ./wrap-directory.sh ./examples/example-draw/javascript/
    $ ls ./examples/example-draw/javascript/
     gjs-app-wrapped.js main.js

Enable loading of this new file, and disable the singular GameJs and Yabble files:

    <!-- <script src="../skeleton/public/yabble.js"></script> -->
    <!-- <script src="../skeleton/public/gamejs-wrapped.js"></script> -->
    <script src="./javascript/gjs-app-wrapped.js"></script>
    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>

Now your application should only rely on the one distribution-wrapped.js file and *not* load any other modules via Ajax during load time. Ship it!

## Compression

Add the second argument `compress` to have the resulting file compressed with Google closure compiler:

    $ ./wrap-directory.sh ./examples/example-draw/javascript/ compress

This will very probably throw warnings but unless you get errors, you should be fine.

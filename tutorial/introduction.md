GameJs
==========

GameJs is modeled after the widely successful PyGame API.

Prerequisites
---------------
I assume you already downloaded the latest GameJs release or - even better - are running a hg checkout.

Note that GameJs only works over a http connection - trying the demos or this tutorial from the local harddrive ("file:///c:/...") won't work! This is due to the optimized way GameJs loads it scripts and resources.


Scaffolding
-------------
Add a folder `gamejstutorial` in a http served location and create the following structure in it:

  * index.html      this is were our startup code goes
  * js/             the actual game code classes
  * js/lib/         the gamejs library goes in here
  * data            images, sounds, etc go in here
  
As mentioned, put everything under `gamejs/lib/` into the `js/lib/` folder you created above. In your tutorial folder you should now have `js/lib/gamejs.js` amongst other files and directories.

Hello World
------------
Let's get something on the screen! The minimal Hello World would probably be a filled rectangle. First we need to include the `lib/js/$require.js` file provided by GameJs. The rest of the GameJs resources will be loaded automatically.

Similiarly to jquery's `$(document).ready()` we have a `$r.ready()` where you put your code. Once the function passed to `ready()` is called GameJs and all resources are garantued to be fully loaded and ready for usage - if you put code outside of the ready function, GameJs might not yet be ready for use.

Okay, so inside the ready function we create the one true display with the call to `gamejs.display.setMode(width, height)`. This returns a GameJs `Surface` (more on that later); everything you draw onto that Surface will be visible to the user.

Finally, we use `gamejs.draw.rect(surface, color, rect, stroke)` to draw the actual Rectangle:

    // index.html
    <script src="./js/lib/$require.js"></script>
    <script>
    $r.ready(function() {
       var displaySurface = gamejs.display.setMode(800, 600);
       gamejs.draw.rect(displaySurface, '#cccccc', new gamejs.Rect(50, 150, 20, 20), 0); // fill
    });
    </script>

Note how we set the last parameter `stroke` to 0, thereby filling the rectangle. Try different values for `stroke` to see what happens.

Surface, Rect,... what's going on?
-----------------------------------
When you are dealing with 2D Graphics a couple of concepts will come up all the time in your code. This is why GameJs provides a lightweight, sensible way that structures those concepts. If you use those components your code will - hopefully - get faster with every GameJs release and more readable to other GameJs coders.

### gamejs.Rect
Rectangles are used for various purposes, all related to defining an area or a position. Be it creating a Surface of a certain size, extracting an area from an image or tracking the position and size of objects. In most places where you can pass a `Rect` you can also pass its array form `[x, y, width, height]` or just `[x, y]` if you only care about a position.

### gamejs.Surface
A Surface represents an image with a fixed width and height. The image is not necessarly visible. Typically if you load an image it will just be in memory, but it gets visible once you blit it onto the main display Surface.

Note that any Surface's area can be described by a Rectangle - that is why every Surface has the property `Surface.rect` which returns just that.

The other two important concepts in GameJs are Sprites, SpriteGroups. I will explain them in the next example.

Hit the monkey
---------------
In the early days of the internet this little game where you try to hit a monkey with a huge fist was a common ad. We will recreate this in GameJs.

We will have to load images and sounds. This is done with the preloader. It's simple. Put a small monkey image into data/monkey.jpg and load it up. For starters we will just display it in the top left corner of the screen - to verify everything is working so far:

    <script src="./js/lib/$require.js"></script>
    <script>
    $r.preload([
        './data/monkey.jpg'
    ]);
    $r.ready(function() {
        var displaySurface = gamejs.display.setMode(800, 600);
        var monkeyImage = gamejs.image.load('/data/monkey.jpg');
        displaySurface.blit(monkeyImage);
    });
    </script>

`monkeyImage` is really just a Surface like `displaySurface`. We can copy surfaces on each other with the `blit()` method. Once you blit image data onto the main display surface it becomes visible - like we do here with the monkey image.

`blit(source, destinationRect, sourceRect)` takes a couple of parameters - all have defaults, that's why the example above works:

  * Surface
        the Surface we copy from (let's call that the source)
  * destinationRect
        the position in the target Surface
  * sourceRect
        the part of the source Surface we want to copy

A couple of simple examples should make this clearer - try them out!

    // blit the image to position [20,20] instead of the top left corner
    displaySurface.blit(monkeyImage, [20, 20]);
    // same as above, but position passed as rectangle
    displaySurface.blit(monkeyImage, new Rect(20, 20));

    // instead of copying the whole monkey image, we only blit the bottom right half
    // of it
    var monkeyRect = monkeyImage.getRect();
    displaySurface.blit(monkeyImage, [20, 20], [monkeyRect.width/2, monkeyRect.height/2]);

The most important, very often used thing you want to remember is the first form hover: `Surface.blit(sourceSurface, [targetX, targetY])`.
















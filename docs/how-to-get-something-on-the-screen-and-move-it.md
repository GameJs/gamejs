HOWTO get something on the screen and move it
==============================================

This is the gist of what your game will do:

  * you evaluate the user's input (mouse and keyboard events)
  * then all the objects update their position and/or their appeareance
  * you clear the screen
  * and finally draw the objects to the screen
  * repeat

We will talk about interesting things like collision detection and actually drawing on the screen in a second. Please bear with me during the next paragraph when I define the most basic bulding block of GameJs that allows us to do those interesting things in a uniform way: `gamejs.sprite.Sprite`.

Sprites
----------
Think of sprites as being a convention that helps you deal with the eval-update-draw cycle mentioned above. Those are the properties that define a sprite:

  * `rect` & `image`: `image` holds the surface of that sprite and `rect` tells us where on the display the sprite wants to be.
  * `sprite.update(msDuration)`: the sprite should update its model and can optionally update `rect` or `image` if necessary (`msDuration` is the duration in milliseconds since `update()` was last called).
  * `sprite.draw(display)`: the sprite draws itself on the passed surface

The nice thing of following this convention is that we can have containers for sprites and utility functions that operate on a high level.

Collission detection & event handling
--------------------------------------
Let's say the user clicked and you want to find out on which of the monster sprites (if any) he clicked. You should already have a sprite group holding all the monsters:

    var monsters = new gamejs.sprite.Group();
    monsters.add(new Monster('Douglas'));
    monsters.add(new Monster('James'));

Then to get all sprites colliding with a point call `Group.collidePoint`. In this case we pass the `event.pos` holding the mouse position because `event.type === gamejs.event.MOUSE_UP`:

    function evaluateEvent(event) {
        if (event.type === gamejs.event.MOUSE_UP) {
            var monstersClickedOn = monsters.collidePoint(event.pos);
            if (monstersClickedOn.lenght > 0) {
                // do something with monster we clicked on
            }
        }
    }

There is lots of those kind of high level functions that know how deal with sprites, sprite groups or rectangles. You too are encouraged to think in those terms and concepts when trying to structure your game.

Updating a sprite's position & appeareance
---------------------------------------------
A simple example for an `update()` method would be, that the monster just moves a certain amount in the direction we created at instantiation (stored in `Monster.directionVector`). What we do is we update the position of `this.rect` by adding the amount we moved (`movementDelta`) to it:

    var $v = require('gamejs/utils/vectors');
    Monster.prototype.update = function(msDuration) {
        var movementDelta = $v.multiply(this.directionVector, msDuration);
        this.rect.center = $v.add(this.rect.center, movementDelta);

        // either use gamejs.utils.vectors when dealing with vectors or explictly
        // deal with both coordinates:
        // this.rect.center[0] = this.rect.center[0] + movementDelta[0];
        // this.rect.center[1] = this.rect.center[1] + movementDelta[1];
        return;
    }

Rectangles are another big building block in GameJs - they are useful for many things. Find out more about them in the [API for gamejs.Rect](http://gamejs.org/api/gamejs/#Rect).

Back to the eval-update-draw cycle; we have everything to actually build it. One more concept to explain: in JavaScript we can not make an endless loop and pause for a certain amount in its body. Instead we create a timer object, which calls a function at a fixed interval.

Timers
---------
In GameJs you create such timers with the `gamejs.time.fpsCallback(function, thisObject, fps)` function. In the following example the (arbitrarily named) function `tick` is called 25 times per second:

    function tick(msDuration) {};
    gamejs.time.fpsCallback(tick, this, 25);

Putting it all together
--------------------------
Inside tick we will run the updates and draw methods of the monster sprite group and the sprite group will in turn call those methods on all the sprites it holds:

    var display = gamejs.display.getSurface();
    function tick(msDuration) {
        monsters.update(msDuration);
        monsters.draw(display);
    };
    gamejs.time.fpsCallback(tick, this, 25);

Last but not least we must evaluate the user's input with the `evaluateEvent()` function. We get the list of events that happened since the last time we asked with `gamejs.event.get()`. And we pass each of it to `evaluateEvent()`:

    gamejs.event.get().forEach(evaluateEvent);

This is all it takes to get something moving on the screen that reacts to your input. Of course there is more to GameJs.

Would you like to know more?
---------------------------------
If you want to learn more about GameJs in general and patterns on how to structure your game, then look at the source of the following. Ordered by growing complexity :)

  * the example apps `example-draw` and `example-sprite`
  * `gamejs.scene.Scene` is a class that holds an eval-update-draw cycle as described in this tutorial; and `gamejs.scene.MovingSprite` is just that: a moving sprite with functions like `setSpeed(value)` or `rotateBy(amount)` for your convinience when prototype.
  * there is an example app called `example-scene` which heavily utilizes `Scene` and `MovingSprite`.
  * `gamejs.iso.AnimatedSprite` - this sprite is animated, meaning it changes its `image` depending on the animation and direction set by you. There's an example app for it too: `example-iso`. Note: you will need an art pipeline if you want to do ISO sprites. I provide a script to do most of the work of importing the ISO sprites from <http://reinerstileset.4players.de/>.

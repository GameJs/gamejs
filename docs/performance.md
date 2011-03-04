Profile!
-----------
Every browser's developer tools have a Profiler.

 * Learn how to profile your game.
 * Learn how to interpret the Profiler's results.

Optimizing "blindly" is worthless.

Cache the result of image operations
-----------------------------------------
Blit'ing is how you update the screen and let's you compose images - so it can not be avoided altogether.

But: If the objects you draw to the screen are created by transforming or blitting Surfaces *every frame* then think about how you could cache the results. Even if you can only cache the result for a couple of frames this could already make a big difference.

If you use gamejs.sprite.Sprite-s and Group-s you already have a two level caching hierarchy.

Surfaces = Memory
----------------------
Surfaces need memory. Every Surface is attached to a canvas DOM element with an image data array, which typically holds kilobytes of data.

When you create a new surface think carefully about how often this is going to get created. And in any case, be sure to clear all references to a Surface to destroy it! The garbage collector can not free the memory if the Surface is still referenced.

Multiple gamejs.time.fpsCallback-s
---------------------------------------
The best optimization is often not runnig the code that often. You can create multiple fps callbacks with `gamejs.time.fpsCallback` to, for example, run the AI code at 10 "frames" per second but the rendering at 30.

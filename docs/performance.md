Surfaces need memory. Every Surface is a canvas DOM element with an image data array at least as big as it's resolution times color depth. When you create a new surface think carefully about how often this is going to get created.

Even if the graphics need to be updated with at least 30 frames per second (yes, you can do 60 if that makes you happy): does collision detection have to go at the same rate? How about the model updates? The best optimization is often not runnig the code that often. You can create multiple fps callbacks with `gamejs.time.fpsCallback`.

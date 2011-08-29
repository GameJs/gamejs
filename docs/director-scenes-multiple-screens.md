If you have multiple 'scenes' in your game, for example a start screen, the actual game screen and an option screen then you will probably want to employ the `Director` and `Scene` concepts.

*There's different names for those concepts. Some call the scenes "stages" or "screens" and obviously the name 'director' is also debatable*

A central director makes it easier to switch between different scenes where each scene has his own independent logic drawing the whole screen and consuming all input event hands. A director could also keep track of a stack of scenes which would allow you to `push()` and `pop()` but this useful extension is not covered in the tutorial.

<img width="200" src=http://www.openclipart.org/image/800px/svg_to_png/wasat_Theatre_Masks.png title="by wasat http://www.openclipart.org/detail/27930">

The director is created with the desired width and height of the display (our director doesn't even expose the display surface):

    var director = new Director(800, 600);

Our director will manage the screen, i.e., create the screen and let the active scene draw on it. It will also query the `gamejs.event` system and pass all events to the active scene. Let's think about the scene API for a moment:

  * the director needs to tell the scene to draw itself onto the display
  * the scene receives events
  * the scene updates with the usual `update(msDuration)` calls every game tick

This is how a start screen could look like:

    var StartScene = function(director) {

      this.handleEvent = function(event) {
         if (event.type === gamejs.event.MOUSE_UP) {
            director.replaceScene(new GameScene(director));
         }
      };

      this.draw = function(display) {
         display.blit(startPicture);
      };

      var startPicture = gamejs.image.load('images/start.png');
      return this;
   };

This scene doesn't have a `update(msDuration)` function because the start screen never changes. It waits for a `gamejs.event.MOUSE_UP` event to switch to the next scene by calling `director.replaceScene(nextScene)`.

Initially, our director is paused and has no scene active. We start the game by calling `director.start(firstScene)`:

    var firstScene = new StartScene(director);
    director.start(firstScene);


The `Director` class, which provides the above functionality, needs to keep track of the active scene and provides boiler plate necessary to start any game: trigger the `gamejs.time.fpsCallback`, process the event list from `gamejs.event.get()`, draw & update:

    function Director (width, height) {
       var onAir = false;
       var activeScene = null;

       function tick(msDuration) {
          if (!onAir) return;

          if (activeScene.handleEvent) {
             gamejs.event.get().forEach(activeScene.handleEvent);
          } else {
             // throw all events away
             gamejs.event.get();
          }
          if (activeScene.update) {
             activeScene.update(msDuration);
          }
          if (activeScene.draw) {
              activeScene.draw(display);
          }
          return;
       };


       this.start = function(scene) {
          onAir = true;
          this.replaceScene(scene);
          return;
       };

       this.replaceScene = function(scene) {
          activeScene = scene;
       };

       this.getScene = function() {
          return activeScene;
       };
       var display = gamejs.display.setMode([width, height]);
       gamejs.time.fpsCallback(tick, this, 30);
       return this;
    };

End of Tutorial

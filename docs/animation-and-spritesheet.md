If you have a sprite that changes its appearance by cycling through predefined images then you're doing what I will call a 'sprite sheet animation'. The images making up an animation cycle will probably be contained in one bigger image - the 'sprite sheet'.

<img src=http://opengameart.org/sites/default/files/coins100.png title="Flying Coins by Clint Bellanger, http://opengameart.org/content/flying-coins-loot">

This sprite sheet, for example,  holds one animation: the coins move up and back down if you cycle through the images from left to right.

ImageMagick (not necessary for this tutorial but...)
-----------------------------------------------------

Unless you spend money, you will be scraping the web for free graphics so your images won't even all be in one format. Try to learn [ImageMagick](http://www.imagemagick.org/script/index.php). It helps you converting, editing, cutting, cropping and composing images programmatically. You don't have to know every command but try to grasp what it can help you with. For starters, figure out what the following `montage` command (one of ImageMagick's) does:

    $ montage images/items/*png -background none -geometry +0+0 -tile 12x images/items.png

<img width=100 alt="© 1999-2011 ImageMagick Studio LLC" src=http://www.imagemagick.org/image/wizard.png>

(spoiler: the `montage` command above composes one big `images/items.png` picture by arranging all `png`s in the directory `images/items/` in a grid with 12 images per row. There is `0` pixels horizontal and vertical spacing between the images in the grid.)


The Animations class
-------------------------

GameJs doesn't have a predefined animation class but it's easy to build a custom one that fits the kind of sprite sheets you have available. One full example implementation is copy & paste ready in this tutorial. I will lay out you *one* way to do animations and how this ties in with the `gamejs.sprite.Sprite` concept.

First, we need to be able to access individual pictures in a sprite sheet. The API for this task should work like this: a `SpriteSheet` is constructed with an image name and an object describing the `{width, height}` of the individual images. Single images can be accessed by call `get(index)` on the SpriteSheet instance:

    var imageDimensions = {width: 64, height: 128};
    var spriteSheet = new SpriteSheet('images/coins.png', imageDimensions);
    var firstImage = spriteSheet.get(0);

The `SpriteSheet` class delegates most of its work to [gamejs.Surface.blit](http://docs.gamejs.org/gamejs/#Surface.prototype.blit). The SpriteSheet constructor builds an array of individual images, the `surfaceCache`, by creating one small `Surface` for each animation cycle image. On to that surface we only blit the currently interesting `area` of the sprite sheet and put it into the `surfaceCache`:

    var SpriteSheet = function(imagePath, sheetSpec) {
       this.get = function(id) {
          return surfaceCache[id];
       };

       var width = sheetSpec.width;
       var height = sheetSpec.height;
       var image = gamejs.image.load(imagePath);
       var surfaceCache = [];
       var imgSize = new gamejs.Rect([0,0],[width,height]);
       // extract the single images from big spritesheet image
       for (var i=0; i<image.rect.width; i+=width) {
           for (var j=0;j<image.rect.height;j+=height) {
             var surface = new gamejs.Surface([width, height]);
             var rect = new gamejs.Rect(i, j, width, height);
             surface.blit(image, imgSize, rect);
             surfaceCache.push(surface);
          }
       }
       return this;
    };

Now that we solved the problem of accessing single images in a sprite sheet we can turn to cycling through those images. We need an `Animation` class which takes a SpriteSheet and an animation specification. The animation specification defines all cycles held by the sprite sheet, ie. the cycle name and the two index position of the first and last image making up a cycle.

Three, named cycles are defined in the following animation specification. The first cycle uses all 6 images (with index 0 to 5) and is named 'flying' while the second cycle, 'pause', consist of only one image:

    {'flying': [0, 5], 'pause': [5]}

We can later use the cycle names to start the cycle. The animation will automatically advance through the images and have a property `image`, which always holds the correct image:

    var animation = new Animation(spriteSheet, {'flying': [0, 5], 'pause': [5]});
    animation.start('walk');
    display.blit(animation.image);

A sprite, which uses an animation instance, would call `animation.update(msDuration)` in its own `update()` function to advance the animation. And in sprite.draw() it accesses `animation.image` to get the current animation's image to put on the screen.

If you are paying attention, you are wondering how the animation knows at which speed it should advance through the images: `Animation` has a third, number argument to pass the images per second of the animation. This default to six in the following example implementation of `Animation`.

<img src=http://opengameart.org/sites/default/files/previews/gold_preview.gif>

If you do not want the animation to cycle, the third array item of the cycle specification must be 'false'. For example, `{flying: [0, 5, false]}` would make the flying cycle stop after one going through the images 0 to 5 once.

Final, the code for the `Animaton` class:

    var Animation = function(spriteSheet, animationSpec, fps) {
       this.fps = fps || 6;
       this.frameDuration = 1000 / this.fps;
       this.spec = animationSpec;

       this.currentFrame = null;
       this.currentFrameDuration = 0;
       this.currentAnimation = null;

       this.spriteSheet = spriteSheet;

       this.loopFinished = false;

       this.image = null;
       return this;
    }

    Animation.prototype.start = function(animation) {
       this.currentAnimation = animation;
       this.currentFrame = this.spec[animation][0];
       this.currentFrameDuration = 0;
       this.update(0);
       return;
    };

    Animation.prototype.update = function(msDuration) {
       if (!this.currentAnimation) {
          throw new Error('No animation started. call start("fooCycle") before updating');
       }

       this.currentFrameDuration += msDuration;
       if (this.currentFrameDuration >= this.frameDuration) {
          this.currentFrame++;
          this.currentFrameDuration = 0;

          // loop back to first frame if animation finished or single frame
          var aniSpec = this.spec[this.currentAnimation];
          if (aniSpec.length == 1 || this.currentFrame > aniSpec[1]) {
             this.loopFinished = true;
             // unless third argument is false, which means: do not loop
             if (aniSpec.length === 3 && aniSpec[2] === false) {
                this.currentFrame--;
             } else {
                this.currentFrame = aniSpec[0];
             }
          }
       }

       this.image = this.spriteSheet.get(this.currentFrame);
       return;
    };

End of Tutorial

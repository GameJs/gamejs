var gamejs = require('../gamejs');

/**
 * @fileoverview Provides Animations and SpriteSheets.
 *
 * @example
 * var spriteSheet = new SpriteSheet(sheetSurface, {width: 16, height: 16});
 * var animationSpec = {
 *    walk: {
 *      frames: [0,1,2,3],
 *      loop: true,
 *      rate: 20 // framerate per second
 *    }
 * }
 * var animation = new Animation(spriteSheet, 'walk', animationSpec);
 * ....
 * animation.update(msDuration)
 * ....
 * display.blit(animation.image);
 *
 */

/**
 * Turn a Surface into a SpriteSheet. This makes individual images ("tiles") within the
 * larger Surface retrievable with the SpriteSheet's `get(indexPositon)` method.
 *
 * Available option properties are (width and height are required):
 *
 *  * `width` individual tile, number
 *  * `height` of individual tile, number
 *  * `spacing` between two tiles, number
 *  * `margin` at the image border without tiles, number
 *  * `scaleTo` [width,height] scale tiles to this size after loading
 *  *
 *
 * @param {Surface} image containing the individual tiles
 * @param {Object} options describing the tile dimensions, size, spacing, etc. (see above)
 */
var SpriteSheet = exports.SpriteSheet = function(image, opts) {
    /** @ignore **/
    this.width = opts.width;
    /** @ignore **/
    this.height = opts.height;
    /** @ignore **/
    this.spacing = opts.spacing || 0;
    /** @ignore **/
    this.margin = opts.margin || 0;
    /** @ignore **/
    this.image = image;

    /** @ignore **/
    this.surfaceCache = [];

    var imgSize = new gamejs.Rect([0,0],[this.width,this.height]);
    if (opts.scaleTo) {
        imgSize = new gamejs.Rect([0,0], opts.scaleTo);
    }

    // Extract the cells from the spritesheet image.
    for (var i = this.margin; i < this.image.rect.height; i += this.height + this.spacing) {
        for (var j = this.margin; j < this.image.rect.width; j += this.width + this.spacing) {
            var surface = new gamejs.graphics.Surface([this.width, this.height]);
            var rect = new gamejs.Rect(j, i, this.width, this.height);
            //surface._context.imageSmoothingEnabled = false;
            surface.blit(this.image, imgSize, rect);
            this.surfaceCache.push(surface);
        }
    }
    return this;
};

/**
 * Retrieve the tile at given index position. The index position can be calculated as:

 *    index = column + row * rowLength
 *
 * @param {Number} index
 * @returns {Surface} the tile surface
 */
SpriteSheet.prototype.get = function(index) {
        return this.surfaceCache[index];
};

/**
 * An Animation is a gamejs.animate.SpriteSheet with an animation specification which
 * explains what states the animation has and which tiles in the SpriteSheet compose
 * those states.
 *
 * An animation specification might look like this:
 *       var npcAnimationSpec = {
 *           idle: {frames: [0], rate: 5, loop: true},
 *           moveup: {frames: [0,1,2,3,4,5,6,7,8], rate: rate, loop: true},
 *           die: {frames: [18,19,20,21,22,23,24,25,26], rate: rate, loop: true},
 *           ....
 *       };
 *
 *  The keys in the npcAnimationSpec are the animation state names and each object
 * is describing on such state: `frames` are the index positions of the tiles in the
 * SpriteSheet making up that state. `rate` is the frequence per second at which the
 * state should switch from tile to tile of the state and `loop` designates whether
 * the state shold end or loop endlessly.
 *
 * @param {gamejs.animate.SpriteSheet} spriteSheet
 * @param {String} initialState name of the initital state
 * @param {Object} animationSpecification
 *
 */
var Animation = exports.Animation = function(spriteSheet, initial, spec) {
    /** @ignore **/
    this.spec = spec;

    /** @ignore **/
    this.currentFrame = null;
    /** @ignore **/
    this.currentFrameDuration = 0;
    /** @ignore **/
    this.currentAnimation = null;
    /** @ignore */
    this._isFinished = false;
    /** @ignore **/
    this.spriteSheet = spriteSheet;
    /** The current tile surface of the animation. Draw this to the screen. **/
    this.image = spriteSheet.get(0);
    this.start(initial);

};

/** @ignore **/
Animation.prototype.setFrame = function(frame) {
    this.frameIndex = frame;
};

/** @ignore **/
Animation.prototype.start = function(name) {
    this._isFinished = false;
    this.setState(name);
    this.update(0);
    return;
};

/**
 * Set the animation to the given state.
 *
 * @param {String} stateName
 */
Animation.prototype.setState = function(name) {
    if (this.currentAnimation === name) {
        return;
    }

    this.currentAnimation = name;
    this.currentFrame = this.spec[name].frames[0];
    this.frameIndex = 0;
    this.currentFrameDuration = 0;
    this.frameDuration = 1000 / this.spec[name].rate;
};

/**
 * Call this function every tick to update the animation.
 *
 * @param {Number} msDuration since last tick
 * @returns {Boolean} whether animation image has changed during this update
 */
Animation.prototype.update = function(msDuration) {
    if (!this.currentAnimation) {
        throw new Error('No animation started.');
    }

    this.currentFrameDuration += msDuration;
    if (this.currentFrameDuration >= this.frameDuration && this._isFinished === false){
        var frames = this.spec[this.currentAnimation].frames;

        this.currentFrame = frames[this.frameIndex++];
        this.currentFrameDuration = 0;

        var length = this.spec[this.currentAnimation].frames.length - 1;
        if (this.frameIndex > length) {
            if (this.spec[this.currentAnimation].loop) {
                this.frameIndex = 0;
                this.currentFrame = frames[this.frameIndex];
            } else {
                this._isFinished = true;
                this.frameIndex--;
                this.currentFrame = frames[this.frameIndex];
            }
        }
        this.image = this.spriteSheet.get(this.currentFrame);
        return true;
    }

    return false;
};

/**
 * Whether the animation has ended. Looping animations never end.
 */
Animation.prototype.isFinished = function() {
    return this._isFinished;
};

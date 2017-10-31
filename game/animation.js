class Animation
{
    /**
     * Creates a new animation
     * @param {string} path folder in which the frames are
     * @param {number} numFrames number of frames to use
     * @param {number} delay time in ms between frames
     */
    constructor(path, numFrames, delay)
    {
        this.path = path;
        this.numFrames = numFrames;
        this.delay = delay;

        this._totalTime = this.numFrames * this.delay;
        this._passedTime = 0;

        registerObject(this);
    }

    update(entity, deltaTime)
    {
        const frame = Math.floor(this._passedTime / this.delay)
        entity.setSprite(`${this.path}/${frame}.png`);

        this._passedTime += deltaTime;

        if(this.isFinished())
        {
            unregisterObject(this);
        }
    }

    isFinished()
    {
        return this._passedTime >= this._totalTime;
    }
}

class AnimationQueue
{
    constructor()
    {
        this.queue = [];
    }

    push(animation, loop)
    {
        this.queue.push({animation, loop});
    }

    update(deltaTime)
    {

    }

    flush()
    {
        this.queue = [];
    }
}

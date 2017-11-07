class Action
{
    /**
     * Creates a new action
     * @param {string} basename basename of all the frames to use
     * @param {number} numFrames number of frames to use
     * @param {any} extras any extra parameters
     */
    constructor(basename, numFrames, extras)
    {
        extras = extras || {};

        this.basename = basename;
        this.numFrames = numFrames;

        /**
         * @property {number} delay the amount of itme in ms between frames
         * @readonly
         */
        this.delay = extras.delay || 1000 / 60;

        /**
         * @property {number} iterations the number of iterations. -1 is infinite
         * @readonly
         */
        this.iterations = extras.iterations || 1;

        /**
         * @property {boolean} reverse should the action be reversed
         * @readonly
         */
        this.reverse = extras.reverse || false;

        /**
         * @property {boolean} alternate should the action be player reversed
         * once every two iterations
         * @readonly
         */
        this.alternate = extras.alternate || false;

        /**
         * @property {string} name the name of the action
         * @readonly
         */
        this.name = extras.name || basename;

        this._totalTime = this.numFrames * this.delay;
        this._passedTime = 0;
        this._passedIterations = 0;
    }

    /**
     * Updates the action. Returns true if finished
     * @param {Entity} entity
     * @param {number} deltaTime
     * @public
     */
    update(entity, deltaTime)
    {
        if(this.isFinished())
        {
            return true;
        }

        const frame = Math.floor(this._passedTime / this.delay);

        // TODO: if alternate and reverse, we need to ignore redondant frames
        entity.setImage(res[this.basename + (this.reverse ? this.numFrames - 1 - frame : frame)]);

        this._passedTime += deltaTime;

        if(this._passedTime >= this._totalTime)
        {
            this._passedIterations++;
            this._passedTime = this._passedTime % this._totalTime;

            if(this.alternate)
            {
                this.reverse = !this.reverse;
            }
        }

        return false;
    }

    /**
     * Returns whether the action is finished or not
     *
     * will always be false for infinite looping actions
     * @return {boolean} true if action is finished
     */
    isFinished()
    {
        if(this.iterations === -1) return false;
        return this._passedIterations >= this.iterations;
    }

    /**
     * Returns a copy of this action with new settings
     *
     * if settings is undefined, the original action is returned
     * @param {any} settings the settings to change
     * @return {Action} itself
     * @public
     */
    changeSettings(settings)
    {
        if(settings === undefined)
        {
            return this;
        }

        settings.delay = settings.delay || this.delay;
        settings.iterations = settings.iterations || this.iterations;
        settings.reverse = settings.reverse || this.reverse;
        settings.alternate = settings.alternate || this.alternate;
        settings.name = this.name;

        return new Action(this.basename, this.numFrames, settings);
    }

    /**
     * Resets the animation so it can start over
     * @return {Action} itself
     * @public
     */
    reset()
    {
        // do not reset infinite looping actions
        if(this.iterations !== -1)
        {
            this._passedIterations = 0;
            this._passedTime = 0;
        }

        return this;
    }

    isInfinite()
    {
        return this.iterations === -1;
    }
}

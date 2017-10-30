class Transition
{
    /**
     * Creates a transition
     * @param {Function} callback the function to call back every frame
     * @param {number} amount the value to call back with over time
     * @param {number} duration the duration of the transition in ms
     * @public
     */
    constructor(callback, amount, duration)
    {
        this.callback = callback;
        this.amount = amount;
        this.duration = duration;

        /**
         * @property {number} _passed the time that has already passed in ms
         * @private
         */
        this._passed = 0;

        registerObject(this);
    }

    /**
     * Update the transition
     * @param {number} deltaTime time passed since the last frame in ms
     * @public
     */
    update(deltaTime)
    {
        // call back with the amount based on the ratio between the time passed
        // and the total duration of the transition
        this.callback(this.amount * (deltaTime / this.duration));

        this._passed += deltaTime;

        // auto remove when done
        if(this.isFinished())
        {
            unregisterObject(this);
        }
    }

    /**
     * Stop the transition prematurely
     * @param {boolean} complete should the transition be completed
     * @public
     */
    stop(complete)
    {
        if(complete)
        {
            this.callback(this.amount * (1 - this._passed / this.duration));
        }

        unregisterObject(this);
    }

    /**
     * Returns true if the transition is done
     * @return {boolean} true if the transition is done
     * @public
     */
    isFinished()
    {
        return this._passed >= this.duration;
    }
}

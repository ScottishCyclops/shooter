/*
class Transition
{
    constructor(action, checkShouldEnd)
    {
        this.action = action;
        this.checkShouldEnd = checkShouldEnd;

        registerObject(this);

    }

    update(deltaTime)
    {
        this.action(deltaTime);

        const shouldEnd = this.checkShouldEnd(deltaTime);
        console.log(shouldEnd);
        if(shouldEnd)
        {
            unregisterObject(this);
        }
    }

    cancel()
    {
        unregisterObject(this);
    }
}
*/

class Transition
{
    constructor(callback, amount, time)
    {
        this.callback = callback;
        this.amount = amount;
        this.time = time;

        this.passed = 0;

        registerObject(this);
    }

    update(deltaTime)
    {
        this.callback(this.amount * (deltaTime / this.time));

        this.passed += deltaTime;

        if(this.isFinished())
        {
            unregisterObject(this);
        }
    }

    /**
     * Stop the transition prematurely
     * @param {boolean} complete should the transition be completed
     */
    stop(complete)
    {
        if(complete)
        {
            this.callback(this.amount * (1 - this.passed / this.time));
        }

        unregisterObject(this);
    }

    isFinished()
    {
        return this.passed >= this.time;
    }
}

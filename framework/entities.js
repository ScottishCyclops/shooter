/*
class Pawn extends Entity
{
    constructor(x, y, speed)
    {
        super(x, y, meter, meter)
        this.addComponent(new ZeroGPawnComponent(speed));
        this.addComponent(new PhysicsComponent(0.1, new Vector));

        addInputEvent(" ", false, false, e =>
        {
            this.addForce(new Vector(0, -50));
        });
    }

    getSpeed(){ return this._components[0].getSpeed(); }

    setSpeed(speed){ this._components[0].setSpeed(speed); }

    addForce(force){ this._components[1].addForce(force); }
}
*/

class Actor extends Entity
{
    constructor(locX, locY, extras)
    {
        super(locX, locY, extras);

        extras = extras || {};

        /**
         * @property {number} speed in meters per millisecond
         * @public
         */
        this.speed = extras.speed || kmhToMms(10); 

        if(extras.controlled)
        {
            this.addComponent(new TopPawnComponent);
        }

        if(extras.keepInBounds)
        {
            this.addComponent(new KeepInBoundsComponent);
        }
    }
}

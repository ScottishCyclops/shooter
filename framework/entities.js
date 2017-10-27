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

    getSpeed(){ return this.components[0].getSpeed(); }

    setSpeed(speed){ this.components[0].setSpeed(speed); }

    addForce(force){ this.components[1].addForce(force); }
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

        this.addComponent(new PhysicsComponent);

        addInputEvent(" ", false, false, () =>
        {
            if(player.components["PhysicsComponent"].canJump)
            {
                player.components["PhysicsComponent"].addForce(UP_VECTOR.multiply(20));
            }

            console.log(player.components["PhysicsComponent"].canJump);
        });
    }
}

class Container extends Entity
{
    /**
     * Creates a container for other Entity
     */
    constructor()
    {
        super(0, 0, { width: 0, height: 0, color: "transparent" });
    }
}

class Canvas extends Entity
{
    /**
     * Canvas - The parent entity of the whole game
     *
     * @param {number} width the width of the canvas
     * @param {number} height the height of the canvas
     * @public
     */
    constructor(width, height)
    {
        super(0, 0, { width: width, height: height, depth: -999 });

        document.body.appendChild(this._html);
    }
}

class Camera extends Container
{
    constructor()
    {
        super();

        this.smoothness = 10;
    }

    moveTo(vec, y)
    {
        super.moveBy(vec, y);
    }

    moveBy(vec, y)
    {
        super.moveBy(vec, y);
    }
}

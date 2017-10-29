const actorState =
{
    STILL: 0,
    WALK: 1,
    JUMP: 2,
    LADDER_UP: 3,
    LADDER_DOWN: 4
};

class MovingEntity extends Entity
{
    constructor(locX, locY, extras)
    {
        super(locX, locY, extras);

        // physics

        this.lastLocation = ZERO_VECTOR;
        this.velocity =     ZERO_VECTOR;
        this.lastVelocity = ZERO_VECTOR;
        // this.acceleration = ZERO_VECTOR;

        this.left =      false;
        this.wasLeft =   false;
        this.right =     false;
        this.wasRight =  false;
        this.top =       false;
        this.wasTop =    false;
        this.bottom =    false;
        this.wasBottom = false;
    }

    updatePhysics(deltaTime)
    {
        let newLocation = this.location;

        this.lastLocation = this.location;
        this.lastVelocity = this.velocity;

        this.wasLeft =   this.left;
        this.wasRight =  this.right;
        this.wasTop =    this.top;
        this.wasBottom = this.bottom;


        /*
        const speed = this.speed * deltaTime * meter;

        if(currentDirections.HORIZONTAL === "RIGHT")
        {
            speed *= -1;
        }
        */

        newLocation = newLocation.add(this.velocity.multiply(deltaTime));

        if(this.location.y >= innerHeight - this.height)
        {
            newLocation = newLocation.setY(innerHeight - this.height);
            this.bottom = true;
        }
        else
        {
            this.bottom = false;
        }

        this.moveTo(newLocation);
    }
}

class Actor extends MovingEntity
{
    constructor(locX, locY, extras)
    {
        super(locX, locY, extras);

        extras = extras || {};

        /**
         * @property {number} speed in meters per millisecond
         * @public
         */
        this.walkingSpeed = extras.walkingSpeed || kmhToMms(60);
        this.climbingSpeed = extras.climbingSpeed || 5;
        this.jumpForce = extras.jumpForce || 100;

        this.inputs = extras.inputs ||
        {
            LEFT:  "a",
            RIGHT: "d",
            UP:    "w",
            DOWN:  "s",
            JUMP:  " "
        };

        this.state = actorState.STILL;
    }

    update(deltaTime)
    {
        /*
        const leftDown = isDown(this.inputs.LEFT);
        const rightDown = isDown(this.inputs.RIGHT);

        if(leftDown !== rightDown)
        {
            if(leftDown)
            {
                this.moveBy(-0.4, 0);
                // this.velocity = new Vector(-this.walkingSpeed, 0);
            }
            else
            {
                this.moveBy(0.6, 0);
                // this.velocity = new Vector(this.walkingSpeed, 0);
            }
        }
        */

        switch(this.state)
        {
            case actorState.STILL:
                this.velocity = ZERO_VECTOR;
                // TODO: set sprite
                this.setColor("blue");

                if(!this.bottom)
                {
                    this.state = actorState.JUMP;
                }
                // if one is pressed but not both
                else if(isDown(this.inputs.LEFT) !== isDown(this.inputs.RIGHT))
                {
                    this.state = actorState.WALK;
                }
                else if(isDown(this.inputs.JUMP))
                {
                    this.velocity = this.velocity.setY(this.jumpForce);
                    this.state = actorState.JUMP;
                }

                break;
            case actorState.WALK:
                // TODO: set sprite
                this.setColor("red");

                if(isDown(this.inputs.LEFT) === isDown(this.inputs.RIGHT))
                {
                    this.state = actorState.STILL;
                    this.velocity = ZERO_VECTOR;
                }
                else if(isDown(this.inputs.RIGHT))
                {
                    if(this.right)
                    {
                        this.velocity = this.velocity.setX(0);
                    }
                    else
                    {
                        this.velocity = this.velocity.setX(this.walkingSpeed);
                    }

                    this.scaleTo(Math.abs(this.scale.x), this.scale.y);
                }
                else if(isDown(this.inputs.LEFT))
                {
                    if(this.left)
                    {
                        this.velocity = this.velocity.setX(0);
                    }
                    else
                    {
                        this.velocity = this.velocity.setX(-this.walkingSpeed);
                    }

                    this.scaleTo(-Math.abs(this.scale.x), this.scale.y);
                }

                if(!bottom)
                {
                    this.state = actorState.JUMP;
                }
                if(isDown(this.inputs.JUMP))
                {
                    this.velocity = this.velocity.setY(this.jumpForce);
                    // TODO: play jump audio
                }

                break;
            case actorState.JUMP:
                // TODO: set sprite
                this.setColor("green");

                // TODO: use meter ?
                this.velocity = this.velocity
                    .subtractY(GRAVITY * meter * deltaTime / 1000);

                    // TODO: remove duplicate
                    if(isDown(this.inputs.LEFT) === isDown(this.inputs.RIGHT))
                    {
                        this.velocity = this.velocity.setX(0);
                    }
                    else if(isDown(this.inputs.RIGHT))
                    {
                        if(this.right)
                        {
                            this.velocity = this.velocity.setX(0);
                        }
                        else
                        {
                            this.velocity = this.velocity.setX(this.walkingSpeed);
                        }

                        this.scaleTo(Math.abs(this.scale.x), this.scale.y);

                    }
                    else if(isDown(this.inputs.LEFT))
                    {
                        if(this.left)
                        {
                            this.velocity = this.velocity.setX(0);
                        }
                        else
                        {
                            this.velocity = this.velocity.setX(-this.walkingSpeed);
                        }

                        this.scaleTo(-Math.abs(this.scale.x), this.scale.y);
                    }
                break;
            case actorState.LADDER_UP:
                break;
            case actorState.LADDER_DOWN:
                break;
        }

        super.update(deltaTime);
        this.updatePhysics(deltaTime);

        if(this.left && !this.wasLeft
            || this.right && !this.wasRight
            || this.top && !this.wasTop
            || this.bottom && !this.wasBottom)
        {
            // TODO: play hit sound
            console.log("hit");
        }
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

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

        this.velocity =     ZERO_VECTOR;
        this.acceleration = ZERO_VECTOR;
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

    addForce(force)
    {
        this.acceleration = this.acceleration.add(force);
    }

    updatePhysics(deltaTime)
    {
        this.wasLeft =   this.left;
        this.wasRight =  this.right;
        this.wasTop =    this.top;
        this.wasBottom = this.bottom;

        //add gravity
        this.acceleration = this.acceleration.addY(GRAVITY * meter * deltaTime * deltaTime);

        //proactive collision detection
        //this is the location we are going to be to next frame

        let wouldCollide = false;
        const newLocation = this.location.add(this.velocity);

        if(!this.velocity.isZero())
        {
            //check for a collision
            for(let i = 0; i < entities.length; i++)
            {
                //ignore self collision
                if(entities[i] === this)
                {
                    continue;
                }

                //if collision is enabled
                if(entities[i].useCollisions)
                {
                    if(
                        overlaps(newLocation,
                        this.getDimensions(),
                        entities[i].location,
                        entities[i].getDimensions())
                    )
                    {
                        console.log("collision");

                        // check the side from which we collide, using the original
                        // location
                        /*
                        if(this.location.y > entities[i].location.y)
                        {
                            // below
                            this.top = true;
                        }
                        else if(this.location.y + this.height < entities[i].location.y + entities[i].height)
                        {
                            // above
                            this.bottom = true;
                        }

                        if(this.location.x )
                        */

                        // TODO: handle collision from all sides. return value from overlaps ?
                        this.bottom = true;
                        this.velocity = this.velocity.setY(0);
                        wouldCollide = true;
                        break;
                    }
                }
            }
        }

        if(!wouldCollide)
        {
            // if the new location won't make us collide, we move to it
            this.moveTo(newLocation);
            this.velocity = this.velocity.add(this.acceleration).limit(TERMINAL_VELOCITY * deltaTime);
        }
        /*
        else
        {
            // TODO: move as far as possible

            // this._velocity = new Vector(0, 0);
            this._velocity = this._velocity.invert().multiply(0.3);
            this.velocity = ZERO_VECTOR;
        }
        */

        // in any case
        this.acceleration = ZERO_VECTOR;
        this.velocity = this.velocity.multiply(1 - DRAG);
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

        /*

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
        */

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

class TextEntity extends Entity
{
    constructor(locX, locY, extras)
    {
        extras = extras || {};

        // change default width for text to avoid line feed
        extras.width = extras.width || 900;

        super(locX, locY, extras);

        this.text = extras.text || "";
        this.bold = extras.bold || false;
        this.family = extras.family || "sans";
        this.size = extras.size || "1em";

        this._updateText();
        this._updateBold();
        this._updateFamily();
        this._updateSize();
    }

    _updateText()
    {
        this._html.innerText = this.text.htmlSpaces();
    }

    _updateBold()
    {
        this._html.style.fontWeight = this.bold ? "bold" : "normal";
    }

    _updateColor()
    {
        this._html.style.color = this.color;
    }

    _updateFamily()
    {
        this._html.style.fontFamily = this.family;
    }

    _updateSize()
    {
        // consider a simple number as expressed in pixels
        this._html.style.fontSize = typeof this.size === "number" ?
            this.size + PX : this.size;
    }

    setText(...text)
    {
        this.text = text.join("");
        this._updateText();
    }

    setBold(bold)
    {
        this.bold = bold;
        this._updateBold();
    }

    setFamily(family)
    {
        this.family = family;
        this._updateFamily();
    }

    setSize(size)
    {
        this.size = size;
        this._updateSize();
    }
}

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

        this.velocity =     ZERO_VECTOR;
        this.acceleration = ZERO_VECTOR;

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

        //proactive collision detection
        //this is the location we are going to be to next frame

        let newLocation = this.location.add(this.velocity);

        if(!this.velocity.isZero())
        {

            this.top = false;
            this.right = false;
            this.bottom = false;
            this.left = false;

            //check for a collision
            for(let i = 0; i < entities.length; i++)
            {
                // ignore self collision
                if(entities[i] === this) continue;

                if(!entities[i].useCollisions) continue;

                const side = getCollisionSide(
                    newLocation,
                    this.getDimensions(),
                    entities[i].location,
                    entities[i].getDimensions());

                // continue of no collision
                if(side === collisionSides.NONE) continue;

                if(side === collisionSides.TOP)
                {
                    this.top = true;
                    this.velocity = this.velocity.minY(0);
                    this.acceleration = this.acceleration.minY(0);

                    // move the max that we can
                    newLocation = newLocation.setY(entities[i].location.y + entities[i].height);
                }
                else if(side === collisionSides.RIGHT)
                {
                    this.right = true;
                    this.velocity = this.velocity.maxX(0);
                    this.acceleration = this.acceleration.maxX(0);

                    newLocation = newLocation.setX(entities[i].location.x - this.width);
                }
                else if(side === collisionSides.BOTTOM)
                {
                    this.bottom = true;
                    this.velocity = this.velocity.maxY(0);
                    this.acceleration = this.acceleration.maxY(0);

                    newLocation = newLocation.setY(entities[i].location.y - this.height);
                }
                else if(side === collisionSides.LEFT)
                {
                    this.left = true;
                    this.velocity = this.velocity.minX(0);
                    this.acceleration = this.acceleration.minX(0);

                    newLocation = newLocation.setX(entities[i].location.x + entities[i].width);
                }
            }
        }

        const diff = this.location.subtract(newLocation);
        world.moveBy(diff);

        this.velocity = this.velocity.add(this.acceleration).multiply(1 - DRAG).setPrecision(1);
        this.acceleration = ZERO_VECTOR;
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
        this.jumpForce = extras.jumpForce || 0.3;
        this.maxJumpPressingTime = extras.maxJumpPressingTime || 1000;
        this.inputs = extras.inputs || {};

        this.state = actorState.JUMP;
        this.jumpPressingTime = this.maxJumpPressingTime;
        this.jumping = false;
    }

    update(deltaTime)
    {
        this.velocity = this.velocity.maxX(this.walkingSpeed).minX(-this.walkingSpeed);

        super.update(deltaTime);
        this.updatePhysics(deltaTime);

        if(!isDown(this.inputs.JUMP) || this.jumpPressingTime <= 0 || this.top || this.bottom)
        {
            this.jumping = false;
            this.jumpPressingTime = this.maxJumpPressingTime;
        }

        if(currentDirection !== "NONE")
        {
            if(this.bottom)
            {
                this.setSprite("res/spaceguy/walk.gif");
            }

            if(currentDirection === "LEFT")
            {
                // don't add if we are already going at max speed
                // note: real max speed will be 2x walkingSpeed
                this.addForce(new Vector(-this.walkingSpeed * deltaTime, 0));
            }
            else
            {
                this.addForce(new Vector(this.walkingSpeed * deltaTime, 0));
            }
        }
        else
        {
            if(this.bottom)
            {
                this.setSprite("res/spaceguy/still.gif");
            }
        }

        if(this.bottom)
        {
            if(isDown(this.inputs.JUMP) && !this.jumping)
            {
                this.jumping = true;
                this.acceleration = this.acceleration.addY(-this.jumpForce * deltaTime / 2);
                this.setSprite("res/spaceguy/jump.gif?+Math.random()");
            }
        }
        else
        {
            this.acceleration = this.acceleration.addY(GRAVITY * meter * deltaTime / 4);
        }

        if(this.bottom && !this.wasBottom)
        {
            this.setSprite("res/spaceguy/land.gif");
        }

        if(this.jumping)
        {
            // console.log(this.jumpPressingTime / this.maxJumpPressingTime * HALF_PI, "      ", (this.jumpPressingTime / this.maxJumpPressingTime));
            this.acceleration = this.acceleration.addY(-this.jumpForce * deltaTime * (this.jumpPressingTime / this.maxJumpPressingTime));
            this.jumpPressingTime -= deltaTime;
            this.setSprite("res/spaceguy/jump.gif");
            // console.log(this.acceleration);
        }

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
                else if(isDown(this.inputs.LEFT) || isDown(this.inputs.RIGHT))
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

        /*
        if(this.left && !this.wasLeft
            || this.right && !this.wasRight
            || this.top && !this.wasTop
            || this.bottom && !this.wasBottom)
        {
            // TODO: play hit sound
            console.log("hit");
        }
        */

        if(this.top && !this.wasTop) console.log("top");
        if(this.right && !this.wasRight) console.log("right");
        if(this.bottom && !this.wasBottom) console.log("bottom");
        if(this.left && !this.wasLeft) console.log("left");
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

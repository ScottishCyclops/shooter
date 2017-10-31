class Actor extends MovingEntity
{
    /**
    * Actor - Class of the main character
    * @param {number} locX the x position in the world of the entity
    * @param {number} locY the y position in the world of the entity
    * @param {any} extras any extra parameters
    * @public
    */
    constructor(locX, locY, extras)
    {
        super(locX, locY, extras);
        extras = extras || {};

        // TODO: fix default parameters
        this.walkingSpeed = extras.walkingSpeed || kmhToMms(60);
        this.climbingSpeed = extras.climbingSpeed || 0.05;
        this.jumpForce = extras.jumpForce || 0.23;
        this.maxJumpPressingTime = extras.maxJumpPressingTime || 1000;
        this.inputs = extras.inputs || {};

        this.jumpPressingTime = this.maxJumpPressingTime;
        this.jumping = false;
    }

    /**
     * Update the actor
     * @param {number} deltaTime time passed since the last frame in ms
     */
    update(deltaTime)
    {
        // limit the horizontal velocity caused by the movement
        // TODO: find another way if the player needs to be lauched back
        this.velocity = this.velocity.maxX(this.walkingSpeed * deltaTime / 4).minX(-this.walkingSpeed * deltaTime / 4);

        super.update(deltaTime);
        this.updatePhysics(deltaTime);

        let ladderCollision = false;

        for(let i = 0; i < ladders.length; i++)
        {
            if(overlapsBoxes(this.location, this.getDimensions(), ladders[i].location, ladders[i].getDimensions()))
            {
                ladderCollision = true;
                break;
            }
        }

        const isDownJump = isDown(this.inputs.JUMP);

        // check if we need to stop jumping
        if(!isDownJump || this.jumpPressingTime <= 0 || this.top || this.bottom)
        {
            this.jumping = false;
            this.jumpPressingTime = this.maxJumpPressingTime;
        }

        // if we are moving in a direction
        if(currentDirections.HORIZONTAL !== directions.NONE)
        {
            // TODO: implement better animation
            if(this.bottom)
            {
                this.setSprite("res/spaceguy/walk.gif");
            }

            if(currentDirections.HORIZONTAL === directions.LEFT)
            {
                this.acceleration = this.acceleration.addX(-this.walkingSpeed * deltaTime);
            }
            else
            {
                this.acceleration = this.acceleration.addX(this.walkingSpeed * deltaTime);
            }
        }
        else
        {
            if(this.bottom)
            {
                this.setSprite("res/spaceguy/still.gif");

                // slow down
                this.velocity = this.velocity.divide(2);
            }
        }

        if(this.bottom)
        {
            // start to jump
            if(isDownJump && !this.jumping)
            {
                this.jumping = true;
                this.acceleration = this.acceleration.addY(-this.jumpForce * deltaTime / 2);
                this.setSprite("res/spaceguy/jump.gif");
            }
        }
        else
        {
            // if we are not colliding with a ladder, or if we are jumping
            if(!ladderCollision || this.jumping)
            {
                // apply gravity as long as we are not in collision at the bottom
                this.acceleration = this.acceleration.addY(GRAVITY * meter * deltaTime / 4);
                this.setSprite("res/spaceguy/jump.gif");
            }
        }

        if(this.bottom && !this.wasBottom)
        {
            this.setSprite("res/spaceguy/land.gif");
        }

        // apply upwards force as long as we are jumping
        // the force decreeses linearly based on the ratio between
        // the time spent jumping and the maximum time we can jump
        if(this.jumping)
        {
            this.acceleration = this.acceleration.addY(-this.jumpForce * deltaTime * (this.jumpPressingTime / this.maxJumpPressingTime));
            this.jumpPressingTime -= deltaTime;
        }

        // ladder climbing

        if(ladderCollision)
        {
            if(currentDirections.VERTICAL !== directions.NONE)
            {
                this.setSprite("res/spaceguy/land.gif");

                if(currentDirections.VERTICAL === directions.UP)
                {
                    this.acceleration = this.acceleration.addY(-this.climbingSpeed * deltaTime);
                }
                else
                {
                    this.acceleration = this.acceleration.addY(this.climbingSpeed * deltaTime);
                }
            }
            else
            {
                this.setSprite("res/spaceguy/still.gif");

                // limit the velocity when not moving on a ladder
                this.velocity = this.velocity.setY(0);
            }
        }

        //TODO: use this code
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
            /*
            if(this.top && !this.wasTop) console.log("top");
            if(this.right && !this.wasRight) console.log("right");
            if(this.bottom && !this.wasBottom) console.log("bottom");
        if(this.left && !this.wasLeft) console.log("left");
        */
    }
}

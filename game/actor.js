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
        this.jumpForce = extras.jumpForce || 5;
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
        this.velocity = this.velocity.maxX(this.walkingSpeed * deltaTime).minX(-this.walkingSpeed * deltaTime);

        super.update(deltaTime);
        this.updatePhysics(deltaTime);

        let ladderCollision = false;

        for(let i = 0; i < ladders.length; i++)
        {
            if(overlapsBoxes(this.location, this.getDimensions(),
                ladders[i].location, ladders[i].getDimensions()))
            {
                ladderCollision = true;
                break;
            }
        }

        const isDownJump = isDown(this.inputs.JUMP);

        // check if we need to stop jumping
        if(!isDownJump || this.jumpPressingTime <= 0 || this.top || (this.bottom && !this.wasBottom))
        {
            this.jumping = false;
            this.jumpPressingTime = this.maxJumpPressingTime;
            console.log("stop jumping");
        }

        if(this.jumping && this.bottom)
        {
            /// modify the bottom. it is possible that for one frame we are
            // still in collision with bottom, but we are jumping
            this.bottom = false;
        }

        // if we are moving in a direction
        if(currentDirections.HORIZONTAL !== directions.NONE)
        {
            if(this.bottom)
            {
                this.queueAction("walk");
            }

            const speed = this.walkingSpeed * deltaTime;

            if(currentDirections.HORIZONTAL === directions.LEFT)
            {
                this.acceleration = this.acceleration.subtractX(speed);
            }
            else
            {
                this.acceleration = this.acceleration.addX(speed);
            }
        }
        else
        {
            if(this.bottom)
            {
                this.queueAction("still");

                // slow down when player stops moving
                if(this.velocity.x !== 0)
                {
                    this.velocity = this.velocity.divideX(deltaTime / 2);
                }
            }
        }

        if(this.bottom)
        {
            // start to jump
            if(isDownJump && !this.jumping)
            {
                this.jumping = true;
                this.acceleration = this.acceleration.subtractY(this.jumpForce);
                console.log("jumping");

                this.playAction("jump").queueAction("fly");
            }

            if(!this.wasBottom)
            {
                this.playAction("land");
            }
        }
        else
        {
            // if we are not colliding with a ladder, or if we are jumping
            // this makes sure if we are jumping and moving over a ladder
            // we won't be stopped
            if(!ladderCollision || this.jumping)
            {
                // apply gravity as long as we are not in collision at the bottom
                this.acceleration = this.acceleration.addY(GRAVITY * deltaTime);
            }
        }

        // apply upwards force as long as we are jumping
        // the force decreeses linearly based on the ratio between
        // the time spent jumping and the maximum time we can jump
        if(this.jumping)
        {
            // force ratio goes from 1 to 0.5
            // as you spend more time holding jump
            // until you jumped for `maxJumpPressingTime`
            const forceRatio = this.jumpPressingTime / this.maxJumpPressingTime / 2 + 0.5;
            // const forceRatio = (1 - this.jumpPressingTime / this.maxJumpPressingTime) / 4;

            // this.acceleration = this.acceleration.addY(-GRAVITY * deltaTime * forceRatio);
            this.acceleration = this.acceleration.subtractY(this.jumpForce * deltaTime / 30 * forceRatio);
            this.jumpPressingTime -= deltaTime;
        }

        // ladder climbing

        if(ladderCollision)
        {
            if(currentDirections.VERTICAL !== directions.NONE)
            {
                // TODO: ladder animation
                this.queueAction("fly");

                const speed = this.climbingSpeed * deltaTime;

                if(currentDirections.VERTICAL === directions.UP)
                {
                    this.acceleration = this.acceleration.subtractY(speed);
                }
                else
                {
                    this.acceleration = this.acceleration.addY(speed);
                }
            }
            else
            {
                this.queueAction("still");

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

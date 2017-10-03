class PawnComponent extends Component
{
    /**
     * PawnComponent - Create a pawn component for mouvement
     * 
     * @param {number} speed in pixels per second
     * @public
     */
    constructor(speed)
    {
        super("PawnComponent", updateMethod.FRAME, parent);

        /**
         * Mouvement speed, stored in pixels per ms
         * 
         * @private
         */
        this._speed = speed / 1000;
    }

    setSpeed(speed){ this._speed = speed / 1000; }

    getSpeed(){ return this._speed * 1000; }

    /**
     * Update the pawn component
     * 
     * @param {Entity} entity the parent entity
     * @param {number} deltaTime time passed since last frame
     * @public
     */
    update(entity, deltaTime)
    {
        super.update(deltaTime);
    }
}

class TopPawnComponent extends PawnComponent
{
    update(entity, deltaTime)
    {
        super.update(deltaTime);

        const speed = this._speed * deltaTime;

        if(currentDirections.HORIZONTAL !== "NONE")
        {
            entity.moveBy(currentDirections.HORIZONTAL === "LEFT" ? -speed : speed, 0);
        }
        if(currentDirections.VERTICAL !== "NONE")
        {
            entity.moveBy(0, currentDirections.VERTICAL === "UP" ? -speed : speed);
        }
    }
}

class ZeroGPawnComponent extends PawnComponent
{
    update(entity, deltaTime)
    {
        super.update(deltaTime);

        const speed = this._speed * deltaTime;

        if(typeof entity.addForce === "function")
        {
            if(currentDirections.HORIZONTAL !== "NONE")
            {
                entity.addForce(new Vector(currentDirections.HORIZONTAL === "LEFT" ? -speed : speed, 0));
            }
            if(currentDirections.VERTICAL !== "NONE")
            {
                entity.addForce(new Vector(0, currentDirections.VERTICAL === "UP" ? -speed : speed));
            }
        }

    }
}

class SidePawnComponent extends PawnComponent
{
    update(entity, deltaTime)
    {
        super.update(deltaTime);

        const speed = this._speed * deltaTime;

        if(currentDirections.HORIZONTAL !== "NONE")
        {
            entity.moveBy(currentDirections.HORIZONTAL === "LEFT" ? -speed : speed, 0);
        }
    }
}


class PhysicsComponent extends Component
{
    /**
     * PhysicsComponent - Create a physics component with gravity and air resistance
     * 
     * @param {number} airResistance amount of air resistance, from 0 (no resisance), to 1 (can't move)
     * @param {Vector} gravity the force vector. it's direction is used as the "down" and it's magnitude is used as the amount of force
     * @public
     */
    constructor(airResistance, gravity)
    {
        super("PhysicsComponent", updateMethod.FRAME);
        this._gravity = gravity || new Vector(0, 9.81);
        this._airResistance = 1 - (airResistance || 0);
        
        /**
         * Velocity
         * 
         * @private
         */
        this._velocity = new Vector(0, 0);

        /**
         * Acceleration
         * 
         * @private
         */
        this._acceleration = new Vector(0, 0);
    }

    /**
     * Initialize the gravity component
     * 
     * @param {Entity} entity the parent
     * @public
     */
    init(entity)
    {
        super.init(entity);

        entity.setCollide(true);
    }

    addForce(force)
    {
        this._acceleration = this._acceleration.add(force);
    }

    /**
     * Update the gravity component
     * 
     * @param {Entity} entity 
     * @param {number} deltaTime 
     * @public
     */
    update(entity, deltaTime)
    {
        super.update(deltaTime);

        //add gravity
        if(!this._gravity.isZero())
        {
            this.addForce(this._gravity.multiply(meter * deltaTime / 1000));
        }

        //console.log(this._velocity);

        //proactive collision detection
        //this is the location we are going to be to next frame

        //TODO: only update if velocity is not 0
        const newLocation = entity._location.add(this._velocity);
        
        //check for a collision
        let wouldCollide = false;
        for(let i = 0; i < entities.length; i++)
        {
            //ignore self collision
            if(entities[i] === entity)
            {
                continue;
            }

            //if collision is enabled
            if(entities[i].getCollide())
            {
                if(collideBoxes(
                    newLocation.add(entity.getWorldLocation()),
                    entity.getDimensions(),
                    entities[i].getLocation().add(entities[i].getWorldLocation()),
                    entities[i].getDimensions()))
                {
                    console.log("would collide");
                    wouldCollide = true;
                    break;
                }
            }
        }

        if(!wouldCollide)
        {
            //if the new location won't make use collide, we move to it
            entity.moveTo(newLocation);
            this._velocity = this._velocity.add(this._acceleration);
        }
        else
        {
            //TODO: move as far as possible

            //TODO: bounce by inverting velocity and absorbing some of it
            //this._velocity = new Vector(0, 0);
            this._velocity = this._velocity.invert().multiply(0.3);
        }

        //in any case
        this._acceleration = new Vector(0, 0);
        this._velocity = this._velocity.multiply(this._airResistance);
    }
}

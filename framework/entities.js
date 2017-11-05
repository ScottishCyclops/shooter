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
    /**
     * MovingEntity - Base class for an entity on which gravity is applied
     * @param {number} locX the x position in the world of the entity
     * @param {number} locY the y position in the world of the entity
     * @param {any} extras any extra parameters
     * @public
     */
    constructor(locX, locY, extras)
    {
        extras = extras || {};
        extras.useCollisions = true;

        super(locX, locY, extras);

        this.velocity =     ZERO_VECTOR;
        this.acceleration = ZERO_VECTOR;

        this.top =       false;
        this.wasTop =    false;
        this.right =     false;
        this.wasRight =  false;
        this.bottom =    false;
        this.wasBottom = false;
        this.left =      false;
        this.wasLeft =   false;
    }

    /**
     * Update the physics of the entity
     * @param {number} deltaTime time passed since the last frame in ms
     */
    updatePhysics(deltaTime)
    {
        this.wasTop =    this.top;
        this.wasRight =  this.right;
        this.wasBottom = this.bottom;
        this.wasLeft =   this.left;

        // proactive collision detection:
        // this is the location we are going to be to next frame
        // given our velocity

        let newLocation = this.location.add(this.velocity);

        // if we have no velocity, we cannot collide with anything new
        // any other moving object will check for itself if it collides with us
        if(!this.velocity.isZero())
        {
            this.top =    false;
            this.right =  false;
            this.bottom = false;
            this.left =   false;

            for(let i = 0; i < entities.length; i++)
            {
                // ignore self collision
                if(entities[i] === this) continue;
                // ignore entities that do not participate
                if(!entities[i].useCollisions) continue;

                const side = getCollisionSide(
                    newLocation,
                    this.getDimensions(),
                    entities[i].location,
                    entities[i].getDimensions());

                // continue if no collision
                if(side === collisionSides.NONE) continue;

                // stop the momentum on the side of the collision
                // set the newLocation as far as we can without colliding
                if(side === collisionSides.TOP)
                {
                    this.top = true;
                    this.velocity = this.velocity.minY(0);
                    this.acceleration = this.acceleration.minY(0);

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
        // TOOD: remove global var use
        world.moveBy(diff);

        // set precision to avoid super small values
        this.velocity = this.velocity.add(this.acceleration).divide(1 + DRAG * deltaTime).setPrecision(1);
        this.acceleration = ZERO_VECTOR;
    }
}

class Container extends Entity
{
    /**
     * Container - A simple invisible entity that is only used as a parent
     * @public
     */
    constructor()
    {
        super(0, 0, { width: 0, height: 0, color: "transparent" });
    }
}

class Canvas extends Entity
{
    /**
     * Canvas - The parent entity of the game
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
    /**
     * TextEntity - An entity that only displays text
     * @param {number} locX the x position in the world of the entity
     * @param {number} locY the y position in the world of the entity
     * @param {any} extras any extra parameters
     * @public
     */
    constructor(locX, locY, extras)
    {
        extras = extras || {};

        // change default width for text to avoid line feeds
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

    /**
     * Sets the text contained in the entity
     * @param {string[]} text bits of text that will be joined
     * @public
     */
    setText(...text)
    {
        this.text = text.join("");
        this._updateText();
    }

    /**
     * Changes the bold state
     * @param {boolean} bold should the text be bold
     * @public
     */
    setBold(bold)
    {
        this.bold = bold;
        this._updateBold();
    }

    /**
     * Sets the font family
     * @param {string} family the new font family
     * @public
     */
    setFamily(family)
    {
        this.family = family;
        this._updateFamily();
    }

    /**
     * Sets the size of the text. if a number is provided, assumed in pixel
     * @param {any} size the new size of the text in a valid CSS representation
     * @public
     */
    setSize(size)
    {
        this.size = size;
        this._updateSize();
    }
}

class Background extends Entity
{
    /**
     * Background - A background entity that moves slower to simulate distance
     * @param {number} locX the x position in the world of the entity
     * @param {number} locY the y position in the world of the entity
     * @param {any} extras any extra parameters
     * @public
     */
    constructor(locX, locY, extras)
    {
        super(locX, locY, extras);

        extras = extras || {};

        this.distanceDivider = extras.distanceDivider || 1;
    }

    /**
     * Moves the entity by the given vector, or x and y values
     * @param {Vector} vec the vector to add to the location, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Background} itself to be chainable
     * @public
     */
    moveBy(vec, y)
    {
        return super.moveBy(Vector.prototype
            .fromVecY(vec, y)
            .divide(this.distanceDivider));
    }
}

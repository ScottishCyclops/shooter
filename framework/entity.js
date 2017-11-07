/// <reference path="../typings/pixi.js.d.ts" />

class Container
{
    constructor(locX, locY)
    {

        /**
         * @property {Vector} location location of the entity in local space
         * @readonly
         */
        this.location = new Vector(locX || 0, locY || 0);

        /**
         * @property {Entity[]} children this entity's children
         * @readonly
         */
        this.children = [];
    }

    /**
     * Moves the entity to the specified location
     * @param {Vector} vec the vector to set the location, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Entity} itself to be chainable
     * @public
     */
    moveTo(vec, y)
    {
        // if(y === undefined)
        const newLocaction = Vector.prototype.fromVecY(vec, y);

        // get how much we need to move all the children
        const diff = this.location.subtract(newLocaction);
        this.location = newLocaction;

        this._updateChildrenLocation(diff);

        // chainable
        return this;
    }

    /**
     * Moves the entity by specified amount
     * @param {Vector} vec the vector to add to the location, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Entity} itself to be chainable
     * @public
     */
    moveBy(vec, y)
    {
        this.location = this.location.add(vec, y);

        const diff = Vector.prototype.fromVecY(vec, y);
        this._updateChildrenLocation(diff);

        return this;
    }

    /**
     * Adds a child to this entity
     * @param {Entity} child the child to add
     * @return {Entity} itself to be chainable
     * @public
     */
    appendChild(child)
    {
        const index = this.children.indexOf(child);
        if(index !== -1)
        {
            return;
        }

        this.children.push(child);
        return this;
    }

    /**
     * Removes a child from this entity
     * @param {Entity} child the child to remove
     * @return {Entity} itself to be chainable
     * @public
     */
    removeChild(child)
    {
        const index = this.children.indexOf(child);
        if(index === -1)
        {
            return;
        }

        this.children.splice(index, 1);
        return this;
    }

    /**
     * Updates all children's location recursively
     * @param {Vector} vec distance to move all the children by
     * @protected
     */
    _updateChildrenLocation(vec)
    {
        this.children.forEach(child =>
        {
            child.moveBy(vec);
        });
    }
}

class Entity extends Container
{
    /**
     * Entity - Base class for anything that is physically present in the world
     * @param {number} locX the x position in the world of the entity
     * @param {number} locY the y position in the world of the entity
     * @param {PIXI.loaders.Resource} image the image ressource
     * @param {any} extras any extra parameters
     * @public
     */
    constructor(locX, locY, image, extras)
    {
        extras = extras || {};

        super(locX, locY);

        /**
         * @property {PIXI.loaders.Resource} image the sprite ressouce
         * @readonly
         */
        this.image = image;

        /**
         * @property {PIXI.Sprite} sprite the underlying PIXI sprite object
         * @readonly
         */
        this.sprite = new PIXI.Sprite(this.image.texture);

        /**
         * @property {Vector} anchor the anchor point from which to transform
         * @readonly
         */
        this.anchor = new Vector(extras.anchorX || 0, extras.anchorY || 0);

        /**
         * @property {number} rotation rotation of the entity in radians
         * @readonly
         */
        this.rotation = extras.rotation || 0;

        /**
         * @property {Vector} scale scale of the entity
         * @readonly
         */
        if(extras.scale)
        {
            this.scale = new Vector(extras.scale, extras.scale);
        }
        else
        {
            this.scale = new Vector(extras.scaleX || 1, extras.scaleY || 1);
        }

        this._updateScale();

        /**
         * @property {number} width width of the entity
         * @readonly
         */
        this.width = extras.width || this.sprite.width;

        /**
         * @property {number} height height of the entity
         * @readonly
         */
        this.height = extras.height || this.sprite.height;

        /**
         * @property {boolean} hidden visibility flag
         * @readonly
         */
        this.hidden = extras.hidden || false;

        /**
         * @property {boolean} useCollisions collision participation flag
         * @readonly
         */
        this.useCollisions = extras.useCollisions || false;


        this._currentAction = undefined;
        this._actions = {};
        this._actionQueue = [];

        /**
         * @property {boolean} pauseAction should the action be paused
         * @public
         */
        this.pauseAction = false;

        this.registered = false;

        this._updateAnchor();
        this._updateWidth();
        this._updateHeight();
        this._updateLocation();
        this._updateRotation();
        this._updateHidden();
        this._updateTexture();

        // auto registering
        if(extras.register || extras.useCollisions)
        {
            registerObject(this);
            this.registered = true;
        }

        canvas.addChild(this.sprite);
    }

    // Transform methods

    /**
     * Moves the entity to the specified location
     * @param {Vector} vec the vector to set the location, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Entity} itself to be chainable
     * @public
     */
    moveTo(vec, y)
    {
        super.moveTo(vec, y);

        this._updateLocation();

        return this;
    }

    /**
     * Moves the entity by specified amount
     * @param {Vector} vec the vector to add to the location, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Entity} itself to be chainable
     * @public
     */
    moveBy(vec, y)
    {
        super.moveBy(vec, y);

        this._updateLocation();

        return this;
    }

    /**
     * Rotates the entity to the specified amount
     * @param {number} angle the angle of rotation in radians
     * @return {Entity} itself to be chainable
     * @public
     */
    rotateTo(angle)
    {
        this.rotation = angle % TWO_PI;
        this._updateRotation();
        return this;
    }

    /**
     * Rotates the entity by the specified amount
     * @param {number} angle the angle of rotation in radians
     * @return {Entity} itself to be chainable
     * @public
     */
    rotateBy(angle)
    {
        this.rotation = (this.rotation + angle) % TWO_PI;
        this._updateRotation();
        return this;
    }

    /**
     * Scales the entity to the specified scale
     * @param {Vector} vec the vector to scale to, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Entity} itself to be chainable
     * @public
     */
    scaleTo(vec, y)
    {
        this.scale = Vector.prototype.fromVecY(vec, y);
        this._updateScale();
        return this;
    }

    /**
     * Scales the entity by the specified amount
     * @param {Vector} vec the vector to scale by, or the x component
     * @param {number} y the y compoenent, or undefined
     * @return {Entity} itself to be chainable
     * @public
     */
    scaleBy(vec, y)
    {
        this.scale = this.scale.multiply(vec, y);
        this._updateScale();
        return this;
    }

    /**
     * Sets the width of the entity
     * @param {number} width new width of the entity
     * @return {Entity} itself to be chainable
     * @public
     */
    setWidth(width)
    {
        this.width = width;
        this._updateWidth();
        return this;
    }

    /**
     * Sets the height of the entity
     * @param {number} height new height of the entity
     * @return {Entity} itself to be chainable
     * @public
     */
    setHeight(height)
    {
        this.height = height;
        this._updateHeight();
        return this;
    }

    /**
     * Sets the visibility of the entity
     * @param {boolean} hidden true to hide the entity
     * @return {Entity} itself to be chainable
     * @public
     */
    setHidden(hidden)
    {
        this.hidden = hidden;
        this._updateHidden();
        return this;
    }

    /**
     * Choose to participate in collisions or not
     * @param {boolean} useCollisions true to participate in collisions
     * @return {Entity} itself to be chainable
     * @public
     */
    setUseCollisions(useCollisions)
    {
        this.useCollisions = useCollisions;

        if(this.useCollisions && !this.registered)
        {
            registerObject(this);
            this.registered = true;
        }
        else
        {
            unregisterObject(this);
            this.registered = false;
        }

        return this;
    }

    /**
     * Sets the background image of the entity
     * @param {PIXI.loaders.Resource} image the loaded ressource sprite
     * @return {Entity} itself to be chainable
     * @public
     */
    setImage(image)
    {
        this.image = image;
        this._updateTexture();
        return this;
    }

    setAnchor(vec, y)
    {
        this.anchor = Vector.prototype.fromVecY(vec, y);

        this._updateAnchor();
    }

    /**
     * Plays an action. flushes the current action queue
     * @param {string} name the unique name of the action
     * @param {any} settings any new settings
     * @return {Entity} itself to be chainable
     * @public
     */
    playAction(name, settings)
    {
        this._currentAction = this._actions[name].changeSettings(settings).reset();

        // flush the action queue
        // this._actionQueue = [];

        return this;
    }

    /**
     * Qeueues an action to be played next
     * @param {string} name the unique name of the action
     * @param {any} settings any new settings
     * @return {Entity} itself to be chainable
     * @public
     */
    queueAction(name, settings)
    {
        if(this._currentAction === undefined)
        {
            // play directly if nothing is beeing played
            return this.playAction(name, settings);
        }

        if(this._currentAction.name === name)
        {
            // don't queue if already running
            return this;
        }

        if(this._actionQueue.length > 0)
        {
            if(this._actionQueue[this._actionQueue.length - 1].name === name)
            {
                // don't queue if already there
                return this;
            }
        }

        this._actionQueue.push(this._actions[name].changeSettings(settings).reset());

        return this;
    }

    /**
     * Adds any number of new actions to this entity
     *
     * if two actions with the same name exist, the last one will be kept
     * @param {Action[]} actions the actions to add
     * @return {Entity} itself to be chainable
     * @public
     */
    addActions(...actions)
    {
        actions.forEach(action =>
        {
            this._actions[action.name] = action;
        });

        return this;
    }

    /**
     * Returns a new Vector with `width` as x and `height` as y
     * @return {Vector} the dimensions of the entity
     * @public
     */
    getDimensions()
    {
        // TODO: take the scale into account
        return new Vector(this.width, this.height);
    }

    /**
     * Returns the center x of the entity
     * @return {number} the center x in pixels
     * @public
     */
    getCenterX()
    {
        return this.location.x + this.width / 2;
    }

    /**
     * Returns the center y of the entity
     * @return {number} the center y in pixels
     * @public
     */
    getCenterY()
    {
        return this.location.y + this.height / 2;
    }

    // Events

    /**
     * Updates the entity
     * @param {number} deltaTime time passed since the last frame in ms
     * @public
     */
    update(deltaTime)
    {
        if(this.pauseAction)
        {
            return;
        }

        if(this._currentAction === undefined)
        {
            return;
        }

        // if the current action is infinite and we've got stuff to play next
        // or if the current action is done, play the next
        if((this._currentAction.isInfinite() && this._actionQueue.length > 0)
            || this._currentAction.update(this, deltaTime))
        {
            this._currentAction = this._actionQueue.shift();
        }
    }

    // PIXI update methods

    _updateAnchor()
    {
        this.sprite.anchor.x = this.anchor.x;
        this.sprite.anchor.y = this.anchor.y;
    }

    _updateLocation()
    {
        this.sprite.position.x = this.location.x;
        this.sprite.position.y = this.location.y;
    }

    _updateRotation()
    {
        this.sprite.rotation = this.rotation;
    }

    _updateScale()
    {
        this.sprite.scale.x = this.scale.x;
        this.sprite.scale.y = this.scale.y;
    }

    _updateWidth()
    {
        this.sprite.width = this.width;
    }

    _updateHeight()
    {
        this.sprite.height = this.height;
    }

    _updateHidden()
    {
        this.sprite.visible = !this.hidden;
    }

    _updateTexture()
    {
        this.sprite.texture = this.image.texture;
        // TODO: don't change the texture size
        this._updateScale();
    }

    // Utilities

    /**
    * Ges the distance from another entity
    * @param {Entity} entity the other entity
    * @return {number} the distance in pixels from the other entity
    * @public
    */
    distanceFrom(entity)
    {
        // TODO: use center
        return this.location.distance(entity.location);
    }
}

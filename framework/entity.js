class Entity
{
    /**
     * Entity - Base class for anything that is physically present in the world
     * @param {number} locX the x position in the world of the entity
     * @param {number} locY the y position in the world of the entity
     * @param {any} extras any extra parameters
     * @public
     */
    constructor(locX, locY, extras)
    {
        extras = extras || {};

        /**
         * @property {Vector} location location of the entity in local space
         * @readonly
         */
        this.location = new Vector(locX || 0, locY || 0);

        /**
         * @property {number} rotation rotation of the entity in radians
         * @readonly
         */
        this.rotation = extras.rotation || 0;

        /**
         * @property {Vector} scale scale of the entity
         * @readonly
         */
        this.scale = new Vector(extras.scaleX || 1, extras.scaleY || 1);

        /**
         * @property {number} width width of the entity
         * @readonly
         */
        this.width = extras.width || meter;

        /**
         * @property {number} height height of the entity
         * @readonly
         */
        this.height = extras.height || meter;

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

        /**
         * @property {number} depth layer of the entity
         * @readonly
         */
        this.depth = extras.depth || 0;

        /**
         * @property {any} color color of the entity in a valid CSS representation
         * @readonly
         */
        this.color = extras.color || 0;

        /**
         * @property {string} sprite the path to the image sprite to use
         * @readonly
         */
        this.sprite = extras.sprite || "";

        /**
         * @property {string} spriteSize the CSS sizing of the background image
         * @readonly
         */
        this.spriteSize = extras.spriteSize || "cover";

        /**
         * @property {Entity[]} children this entity's children
         * @readonly
         */
        this.children = [];

        /**
         * @property {any} _html html div element
         * @private
         */
        this._html = document.createElement("div");

        this._currentAction = undefined;
        this._actions = {};
        this._actionQueue = [];

        /**
         * @property {boolean} pauseAction should the action be paused
         * @public
         */
        this.pauseAction = false;

        this.registered = false;

        // html element basic styling
        this._html.style.position = "absolute";
        this._html.style.top = 0;
        this._html.style.left = 0;
        this._html.style.overflow = "initial";

        this._updateTransform();
        this._updateWidth();
        this._updateHeight();
        this._updateHidden();
        this._updateDepth();
        this._updateColor();
        this._updateBackground();
        this._updateBackgroundSize();

        // auto registering
        if(extras.register || extras.useCollisions)
        {
            registerObject(this);
            this.registered = true;
        }
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
        // if(y === undefined)
        const newLocaction = Vector.prototype.fromVecY(vec, y);

        // get how much we need to move all the children
        const diff = this.location.subtract(newLocaction);
        this.location = newLocaction;

        this._updateTransform();

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
        this._updateTransform();

        const diff = Vector.prototype.fromVecY(vec, y);
        this._updateChildrenLocation(diff);

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
        this._updateTransform();
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
        this._updateTransform();
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
        this._updateTransform();
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
        this._updateTransform();
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
     * Sets the depth / layer of the entity
     * @param {number} depth the depth or layer of the entity
     * @return {Entity} itself to be chainable
     * @public
     */
    setDepth(depth)
    {
        this.depth = depth;
        this._updateDepth();
        return this;
    }

    /**
     * Sets the fill color of the entity
     * @param {string} color a valid CSS color representation
     * @return {Entity} itself to be chainable
     * @public
     */
    setColor(color)
    {
        this.color = color;
        this._updateColor();
        return this;
    }

    /**
     * Sets the background image of the entity
     * @param {string} sprite the path to the image
     * @return {Entity} itself to be chainable
     * @public
     */
    setSprite(sprite)
    {
        this.sprite = sprite;
        this._updateBackground();
        return this;
    }

    /**
     * Sets the CSS sizing of the sprite. default: cover
     * @param {string} size a valid CSS representation of the size
     */
    setSpriteSize(size)
    {
        this.spriteSize = size;
        this._updateBackgroundSize();
        return this;
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
        this._actionQueue = [];

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
     * Sets a callback when left clicking on the entity
     * @param {Function} callback the function to call back on left click
     * @return {Entity} itself to be chainable
     * @public
     */
    onLeftClick(callback)
    {
        this._html.onclick = callback;
        return this;
    }

    /**
     * Sets a callback when right clicking on the entity
     * @param {Function} callback the function to call back on right click
     * @return {Entity} itself to be chainable
     * @public
     */
    onRightClick(callback)
    {
        this._html.oncontextmenu = callback;
        return this;
    }

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

        // if returns true, it is finished
        if(this._currentAction.update(this, deltaTime))
        {
            // shift will return undefined if the array is empty
            this._currentAction = this._actionQueue.shift();
        }
    }

    // CSS update methods

    _updateTransform()
    {
        // auto offset to center of div when drawing
        this._html.style.transform = `translate${this.location.toCssString(PX)} scale${this.scale.toCssString()} rotate(${this.rotation}rad)`;
    }

    _updateWidth()
    {
        this._html.style.width =  this.width + PX;
    }

    _updateHeight()
    {
        this._html.style.height = this.height + PX;
    }

    _updateHidden()
    {
        this._html.style.display = this.hidden ? "none" : "block";
    }

    _updateDepth()
    {
        this._html.style.zIndex = this.depth;
    }

    _updateColor()
    {
        this._html.style.backgroundColor = this.color;
    }

    _updateBackground()
    {
        this._html.style.backgroundImage = `url(${this.sprite})`;
    }

    _updateBackgroundSize()
    {
        this._html.style.backgroundSize = this.spriteSize;
    }

    // Utilities

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
        // add to the dom
        canvas._html.appendChild(child._html);

        // TODO: fix why it is needed
        // child.moveBy(ZERO_VECTOR);
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
        this._html.removeChild(child._html);
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

"use strict"

class Entity
{
    /**
     * Entity - Base class for anything that is physically present in the game world
     *
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
         * @property {Entity[]} _children this entity's children
         * @readonly
         */
        this.children = [];

        /**
         * @property {any} components the indexed list of components of this entity
         * @readonly
         */
        this.components = {};

        /**
         * @property {any} _html html div element
         * @protected
         */
        this._html = document.createElement("div");

        // html element basic styling
        this._html.style.position = "absolute";
        this._html.style.top = 0;
        this._html.style.left = 0;
        this._html.style.backgroundSize = "cover";
        this._html.style.overflow = "initial";

        this._updateTransform();
        this._updateWidth();
        this._updateHeight();
        this._updateHidden();
        this._updateDepth();
        this._updateColor();
        this._updateBackground();

        // auto registering
        registerObject(this);
    }

    // Transform methods

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

    moveBy(vec, y)
    {
        this.location = this.location.add(vec, y);
        this._updateTransform();

        const diff = Vector.prototype.fromVecY(vec, y);
        this._updateChildrenLocation(diff);

        return this;
    }

    rotateTo(angle)
    {
        this.rotation = angle % TWO_PI;
        this._updateTransform();
        return this;
    }

    rotateBy(angle)
    {
        this.rotation = (this.rotation + angle) % TWO_PI;
        this._updateTransform();
        return this;
    }

    scaleTo(vec, y)
    {
        this.scale = Vector.prototype.fromVecY(vec, y);
        this._updateTransform();
        return this;
    }

    scaleBy(vec, y)
    {
        this.scale = this.scale.multiply(vec, y);
        this._updateTransform();
        return this;
    }

    setWidth(width)
    {
        this.width = width;
        this._updateWidth();
        return this;
    }

    setHeight(height)
    {
        this.height = height;
        this._updateHeight();
        return this;
    }

    setHidden(hidden)
    {
        this.hidden = hidden;
        this._updateHidden();
        return this;
    }

    setUseCollisions(useCollisions)
    {
        this.useCollisions = useCollisions;
        return this;
    }

    setDepth(depth)
    {
        this.depth = depth;
        this._updateDepth();
        return this;
    }

    setColor(color)
    {
        this.color = color;
        this._updateColor();
        return this;
    }

    setSprite(sprite)
    {
        this.sprite = sprite;
        this._updateBackground();
        return this;
    }

    getDimensions()
    {
        return new Vector(this.width, this.height);
    }

    getCenterX()
    {
        return this.location.x + this.width / 2;
    }

    getCenterY()
    {
        return this.location.y + this.height / 2;
    }

    // Events

    onLeftClick(callback)
    {
        this._html.onclick = callback;
        return this;
    }

    onRightClick(callback)
    {
        this._html.oncontextmenu = callback;
        return this;
    }

    update(deltaTime)
    {
        for(const i in this.components)
        {
            this.components[i].update(this, deltaTime);
        }
        return this;
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

    // Utilities

    /**
     * Add a child to this entity
     *
     * @param {Entity} child the child to add
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

        this._updateChildLocation(child, ZERO_VECTOR);
        return this;
    }

    /**
     * Remove a previously added child from this entity
     *
     * @param {Entity} child the child to remove
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
     * update one child's world location
     * @param {Entity} child the child to update
     * @protected
     */
    _updateChildLocation(child, vec)
    {
        // moving the child automatically updates his own childrens
        child.moveBy(vec);
    }

    /**
     * Update all children's world location recursively
     * @param {Vector} vec distance to move all the children by
     * @protected
     */
    _updateChildrenLocation(vec)
    {
        this.children.forEach(child =>
        {
            this._updateChildLocation(child, vec);
        });
    }

    /**
     * Add a component to this entity
     * @param {Component} component the component to add
     * @public
     */
    addComponent(component)
    {
        this.components[component.name] = component;
        component.init(this);
        return this;
    }

    /**
     * Removes the component with the given name
     * @param {string} name name of the component to remove
     */
    removeComponent(name)
    {
        this.components[name] = undefined;
        return this;
    }

    /**
    * Get the distance with another entity
    *
    * @param {Entity} entity the other entity
    * @public
    */
    distanceFrom(entity)
    {
        return this.location.distance(entity.location);
    }
}

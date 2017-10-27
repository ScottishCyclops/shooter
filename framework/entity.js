"use strict"

const DEFAULT_SIZE = 32;

const origin =
{
    TOPLEFT: 0,
    CENTER: 1,

};

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
         * @property {Vector} forward the forward vector of the entity (facing up at first)
         * @readonly
         */
        this.forward = UP_VECTOR;

        /**
         * @property {number} width width of the entity
         * @readonly
         */
        this.width = extras.width;

        /**
         * @property {number} height height of the entity
         * @readonly
         */
        this.height = extras.height;

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
         * @property {Entity[]} _children this entity's children
         * @protected
         */
        this._children = [];

        /**
         * @property {any} components the indexed list of components of this entity
         * @readonly
         */
        this.components = {};

        this._background = extras.spritePath || "";
        this._offset = new Vector;

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

        this.setOrigin(extras.origin || origin.TOPLEFT);

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

    setOrigin(mode)
    {
        switch(mode)
        {
            case origin.TOPLEFT: this._offset = new Vector;                                  break;
            case origin.CENTER:  this._offset = new Vector(this.width / 2, this.height / 2); break;
        }

        return this;
    }

    setSprite(spritePath)
    {
        this._background = spritePath;
        this._updateBackground();
    }

    // Events

    onLeftClick(callback)
    {
        this._html.onclick = callback;
    }

    onRightClick(callback)
    {
        this._html.oncontextmenu = callback;
    }

    update(deltaTime)
    {
        for(const i in this.components)
        {
            this.components[i].update(this, deltaTime);
        }
    }

    // CSS update methods

    _updateTransform()
    {
        // auto offset to center of div when drawing
        this._html.style.transform = `translate${this.location.subtract(this._offset).toCssString(PX)} scale${this.scale.toCssString()} rotate(${this.rotation}rad)`;
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
        this._html.style.backgroundImage = `url(${this._background})`;
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
        const index = this._children.indexOf(child);
        if(index !== -1)
        {
            return;
        }

        this._children.push(child);
        // add to the dom
        canvas._html.appendChild(child._html);

        this._updateChildLocation(child, new Vector(0, 0));
    }

    /**
     * Remove a previously added child from this entity
     *
     * @param {Entity} child the child to remove
     * @public
     */
    removeChild(child)
    {
        const index = this._children.indexOf(child);
        if(index === -1)
        {
            return;
        }

        this._children.splice(index, 1);
        this._html.removeChild(child._html);
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
        this._children.forEach(child =>
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
    }

    /**
     * Removes the component with the given name
     * @param {string} name name of the component to remove
     */
    removeComponent(name)
    {
        this.components[name] = undefined;
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

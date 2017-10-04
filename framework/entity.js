"use strict"

const DEFAULT_SIZE = 32;

class Entity
{
    /**
     * Entity - Base class for anything that is physically present in the game world
     * 
     * @param {number} x the x position in the world of the entity
     * @param {number} y the y position in the world of the entity
     * @param {number} w the width of the entity
     * @param {number} h the height of the entity
     * @public
     */
    constructor(x, y, w, h)
    {
        /**
         * The location of the entity in local space
         * 
         * @private
         */
        this._location = new Vector(x, y);
        /**
         * The location of the entity in world space
         * 
         * @private
         */
        this._worldLocation = new Vector(0, 0);
        /**
         * The rotation of the entity in radians
         * 
         * @private
         */
        this._rotation = 0;
        /**
         * The scale of the entity
         * 
         * @private
         */
        this._scale = new Vector(1, 1);
        /**
         * Dimensions: width and height
         * 
         * @private
         */
        this._dim = new Vector(w, h);
        /**
         * Visibility flag
         * 
         * @private
         */
        this._hidden = false;
        /**
         * Should the entity use collisions
         * 
         * @private
         */
        this._collide = false;
        /**
         * HTML element
         * 
         * @private
         */
        this._html = document.createElement("div");
        /**
         * Array of entity children
         * 
         * @private
         */
        this._children = [];
        /**
         * Depth of the entity. it's CSS Z-index
         * 
         * @private
         */
        this._depth = 0;
        /**
         * Components list
         * 
         * @private
         */
        this._components = [];

        //html element basic styling
        this._html.style.position = "absolute";
        this._html.style.top =  0 + PX;
        this._html.style.left = 0 + PX;
        this._html.style.width =  (w || DEFAULT_SIZE) + PX;
        this._html.style.height = (h || DEFAULT_SIZE) + PX;
        
        this._updateTransform();

        //auto registering
        registerEntity(this);
    }

    //Private methods

    /**
     * Private method updating the CSS transform
     * 
     * @private
     */
    _updateTransform()
    {
        this._html.style.transform = "translate" + this._location.add(this._worldLocation).toCssString(PX) + " scale" + this._scale.toCssString() + " rotate(" + this._rotation + "rad)";
    }

    /**
     * update one child's world location
     * @param {Entity} child the child to update
     */
    _updateChildLocation(child)
    {
        child._setWorldLocation(this._worldLocation.add(this._location));
        child._updateChildrenLocation();
    }

    //Protected methods

    /**
     * Update all children's world location recursively
     * 
     * @protected
     */
    _updateChildrenLocation()
    {
        this._children.forEach(child =>
        {
            this._updateChildLocation(child);
        });
    }

    /**
     * Setter for the world location
     * 
     * @param {Vector} worldLocation the new world location
     * @protected
     */
    _setWorldLocation(worldLocation){ this._worldLocation = worldLocation; }

    //Public methods

    //  Events

    onLeftClick(callback)
    {
        this._html.onclick = callback;
    }

    onRightClick(callback)
    {
        this._html.oncontextmenu = callback;
    }

    onKeyUp(callback)
    {
        this._html.onkeyup = callback;
    }

    onKeyDown(callback)
    {
        this._html.onkeydown = callback;
    }

    //  Getters

    getLocation(){ return this._location; }

    getWorldLocation(){ return this._worldLocation; }

    getRotation(){ return this._rotation; }

    getScale(){ return this._scale; }

    getDimensions(){ return this._dim; }

    isHidden(){ return this._hidden; }

    getCollide(){ return this._collide; }

    getHtmlElement(){ return this._html; }

    getDepth(){ return this._depth; }

    //  Setters

    setDepth(depth)
    {
        this._depth = depth;
        this._html.style.zIndex = this._depth;
    }

    setCollide(collide){ this._collide = collide; }

    //  Style
    
    fill(color)
    {
        this._html.style.background = color;
    }

    //  Components

    addComponent(component)
    {
        this._components.push(component);
        component.init(this);
    }

    update(deltaTime)
    {
        this._components.forEach(component =>
        {
            component.update(this, deltaTime);
        });
    }
    /*
    removeComponent(component)
    {
        this._components.splice(this._components.indexOf())
    }
    */
    
    //  Transform methods

    moveTo(vec, y)
    {
        if(y === undefined)
        {
            this._location = vec;
        }
        else
        {
            this._location = new Vector(vec, y);
        }

        this._updateTransform();
    }

    moveBy(vec, y)
    {
        this._location = this._location.add(vec, y);
        this._updateTransform();
    }
    
    rotateTo(angle)
    {
        this._rotation = angle;
        this._updateTransform();
    }

    rotateBy(angle)
    {
        this._rotation += angle;
        this._updateTransform();
    }

    scaleTo(vec, y)
    {
        if(y === undefined)
        {
            this._scale = vec;
        }
        else
        {
            this._scale = new Vector(vec, y);
        }

        this._updateTransform();
    }

    scaleBy(vec, y)
    {
        this._scale = this._scale.multiply(vec, y);
        this._updateTransform();
    }

    //  Utilities

    /**
     * Add a child to this entity
     * 
     * @param {Entity} child the child to add
     * @public
     */
    appendChild(child)
    {
        const index = this._children.indexOf(child);
        if(index === -1)
        {
            this._children.push(child);
            this._html.appendChild(child.getHtmlElement());

            this._updateChildLocation(child);
        }
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
        if(index !== -1)
        {
            this._children.splice(index, 1);
            this._html.removeChild(child.getHtmlElement());

            child._setWorldLocation(new Vector(0, 0));
        }
    }

    hide()
    {
        this._hidden = true;
        this._html.style.display = "none";
    }

    show()
    {
        this._hidden = false;
        this._html.style.display = "block";
    }

    /**
     * Get the distance with another entity
     * 
     * @param {Entity} entity the other entity
     * @public
     */
    distanceFrom(entity)
    {
        return this._location.distance(entity._location);
    }
}

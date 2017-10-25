const updateMethod =
{
    FRAME: 0,
    DELAY: 1,
    MANUAL: 2,
};

class Component
{
    /**
     * Component - Base class for each components
     * 
     * @param {string} name 
     * @param {number} method 
     * @param {any} extra 
     * @public
     */
    constructor(name, method, extra)
    {
        /**
         * Component name
         * 
         * @public
         */
        this.name = name;
        
        /**
         * Update method
         * 
         * @private
         */
        this._method = method;
        
    }

    init(entity)
    {
        return;
    }

    update(deltaTime)
    {
        return;
    }
}

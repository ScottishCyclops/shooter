"use strict"

class Canvas extends Entity
{
    /**
     * Canvas - The entity where the whole game lives
     * 
     * @param {number} w the width of the canvas. default: window size
     * @param {number} h the height of the canvas. default: window size
     * @public
     */
    constructor(w, h)
    {
        super(0, 0, w || window.innerWidth, h || window.innerHeight);

        const body = document.getElementsByTagName("body")[0];
        
        if(body === undefined)
        {
            console.error("-- Could not find `body` element in HTML --");
        }
        else
        {
            body.appendChild(this._html);
        }

        this.setDepth(-999);
    }
}
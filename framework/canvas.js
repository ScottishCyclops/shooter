"use strict"

class Canvas extends Entity
{
    /**
     * Canvas - The parent entity of the whole game
     * 
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

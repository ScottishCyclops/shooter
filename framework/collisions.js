/**
 * Detect if two entities are colliding using the provided collision method
 *
 * @param {Entity} entity1
 * @param {Entity} entity2
 * @param {number} method the method to use to check for collision in `collideMethods`. Default is circle collision
 */
function collideEntities(entity1, entity2, method)
{
    const loc1 = entity1.location;
    const loc2 = entity2.location;
    const dim1 = {x: entity1.width, y: entity1.height};
    const dim2 = {x: entity2.width, y: entity2.height};

    method = method || collideMethods.BOX;

    switch(method)
    {
        case collideMethods.BOX:    return collideBoxes(loc1, dim1, loc2, dim2);       break;
        case collideMethods.CIRCLE: return collideCircles(loc1, dim1.x, loc2, dim2.x); break;
    }
}

/**
 * Collide two circles
 *
 * @param {Vector} loc1 location of the first circle
 * @param {number} diam1 diameter of the first circle
 * @param {Vector} loc2 location of the second circle
 * @param {number} diam2 diameter of the second circle
 */
function collideCircles(loc1, diam1, loc2, diam2)
{
    return loc1.distance(loc2) < diam1 + diam2;
}

/**
 * Returns wheter two rectangles overlap or not
 * @param {Vector} loc1 location of the first rectangle
 * @param {Vector} dim1 dimensions of the first rectangle
 * @param {Vector} loc2 location of the second rectangle
 * @param {Vector} dim2 dimensions of the second rectangle
 * @return {boolean} true if the rectangles overlap
 */
function overlaps(loc1, dim1, loc2, dim2)
{
    return loc1.x < loc2.x + dim2.x &&
           loc1.x + dim1.x > loc2.x &&
           loc1.y < loc2.y + dim2.y &&
           loc1.y + dim1.y > loc2.y;
}


/**
 * Returns wheter two rectangles overlap or not
 * @param {Vector} loc1 location of the first rectangle
 * @param {Vector} dim1 dimensions of the first rectangle
 * @param {Vector} loc2 location of the second rectangle
 * @param {Vector} dim2 dimensions of the second rectangle
 * @return {boolean} true if the rectangles overlap
 */
/*
function overlaps(loc1, dim1, loc2, dim2)
{
    if(Math.abs(loc1.x - loc2.x) > (dim1.x / 2) + (dim2.y / 2))
    {
        return false;
    }

    if(Math.abs(loc1.y - loc2.y) > (dim1.y / 2) + (dim2.x / 2))
    {
        return false;
    }

    return true;
}
*/

const collisionSides =
{
    NONE: -1,
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
};

// https://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-collision-algorithm-that-also-determines-which-sides-that
/**
 * Returns the side on which a collision happened
 * @param {Vector} loc1 location of the first rectangle
 * @param {Vector} dim1 dimensions of the first rectangle
 * @param {Vector} loc2 location of the second rectangle
 * @param {Vector} dim2 dimensions of the second rectangle
 * @return {number} a value in `collisionSides`
 */
function getCollisionSide(loc1, dim1, loc2, dim2)
{
    const w = 0.5 * (dim1.x + dim2.x);
    const h = 0.5 * (dim1.y + dim2.y);
    const dx = (loc1.x + dim1.x / 2) - (loc2.x + dim2.x / 2);
    const dy = (loc1.y + dim1.y / 2) - (loc2.y + dim2.y / 2);

    if(Math.abs(dx) <= w && Math.abs(dy) <= h)
    {
        const wy = w * dy;
        const hx = h * dx;

        const wxGtHx = wy > -hx;

        if(wy > hx)
        {
            if(wxGtHx) return collisionSides.TOP;
            else return collisionSides.RIGHT;
        }
        else
        {
            if(wxGtHx) return collisionSides.LEFT;
            else return collisionSides.BOTTOM;
        }
    }

    return collisionSides.NONE;
}

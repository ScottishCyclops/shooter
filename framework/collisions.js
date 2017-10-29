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
 * Collide two boxes
 *
 * @param {Vector} loc1 location of the first box
 * @param {Vector} dim1 dimensions of the first box
 * @param {Vector} loc2 location of the second box
 * @param {Vector} dim2 dimensions of the second box
 */
function collideBoxes(loc1, dim1, loc2, dim2)
{
    return loc1.x < loc2.x + dim2.x &&
           loc1.x + dim1.x > loc2.x &&
           loc1.y < loc2.y + dim2.y &&
           loc1.y + dim1.y > loc2.y;
}

function overlaps(entity1, entity2)
{
    if(Math.abs(entity1.location.x - entity2.location.x) > (entity1.width / 2) + (entity2.height / 2)) return false;
    if(Math.abs(entity1.location.y - entity2.location.y) > (entity1.height / 2) + (entity2.width / 2)) return false;
    return true;
}

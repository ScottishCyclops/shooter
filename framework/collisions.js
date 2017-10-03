/**
 * Detect if two entities are colliding using box collisions
 * @param {Entity} entity1 
 * @param {Entity} entity2 
 */
function collideEntities(entity1, entity2)
{
    const loc1 = entity1.getLocation().add(entity1.getWorldLocation());
    const loc2 = entity2.getLocation().add(entity2.getWorldLocation());
    const dim1 = entity1.getDimensions();
    const dim2 = entity2.getDimensions();

    return collideBoxes(loc1, dim1, loc2, dim2);
}

function collideBoxes(loc1, dim1, loc2, dim2)
{
    return loc1.x < loc2.x + dim2.x &&
           loc1.x + dim1.x > loc2.x &&
           loc1.y < loc2.y + dim2.y &&
           loc1.y + dim1.y > loc2.y;  
}
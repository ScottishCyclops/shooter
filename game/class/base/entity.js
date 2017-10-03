class Entity
{
    constructor(x, y)
    {
        this.position = createVector(x, y);
    }

    isInBound()
    {
        return this.position.x >= 0 && this.position.x <= width - 1 && this.position.y >= 0 && this.position.y <= height - 1;
    }

    distanceFrom(entity)
    {
        return this.position.dist(entity.position);
    }

    update()
    {
        return;
    }
}

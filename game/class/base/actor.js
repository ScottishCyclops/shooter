class Actor extends Entity
{
    constructor(x, y)
    {
        super(x, y)
        this.velocity = createVector(0, 0);
        this.speed = 0;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.size = 20;
    }

    update()
    {
        this.velocity.normalize();
        this.position.add(this.velocity.mult(this.speed));
        this.velocity = createVector(0, 0);
    }

    draw()
    {
        noStroke();
        fill(0);
        ellipse(this.position.x, this.position.y, this.size);
    }

    isDead()
    {
        return int(this.health) <= 0;
    }
}

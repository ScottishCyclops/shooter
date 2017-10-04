class Actor extends Entity
{
    constructor(x, y)
    {
        super(x, y, meter, meter)
        this.velocity = new Vector();
        this.speed = 0;
        this.maxHealth = 100;
        this.health = this.maxHealth;
    }

    update()
    {
        this.velocity.normalize();
        this.position.add(this.velocity.mult(this.speed));
        this.velocity = createVector(0, 0);
    }

    isDead()
    {
        return int(this.health) <= 0;
    }
}

class Character extends Actor
{
    constructor(locX, locY, extras)
    {
        super(locX, locY, extras);

        this._maxHealth = 100;
        this.health = this._maxHealth;
        this.resistance = 30;
    }

    hit(damage)
    {
        const realDamage = damage - randFloat(this.resistance);

        if(realDamage > 0)
        {
            this.health -= damage;
        }

        // chainable
        return this;
    }

    kill()
    {
        this.health = 0;
        unregisterObject(this);
    }

    isDead()
    {
        return this.health <= 0;
    }
}

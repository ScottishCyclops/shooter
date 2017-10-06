class Actor extends Entity
{
    constructor(x, y, r)
    {
        super(x, y, r, r);
        /**
         * Speed in meters/seconds
         * @public
         */
        this.speed = 0;
        this._maxHealth = 100;
        this.health = this._maxHealth;
    }

    update(delta)
    {
        return;
    }

    isDead()
    {
        return Math.floor(this.health) <= 0;
    }
}

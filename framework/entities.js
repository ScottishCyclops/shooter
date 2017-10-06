class Pawn extends Entity
{
    constructor(x, y, speed)
    {
        super(x, y, meter, meter)
        this.addComponent(new ZeroGPawnComponent(speed));
        this.addComponent(new PhysicsComponent(0.1, new Vector));

        addInputEvent(" ", false, false, e =>
        {
            this.addForce(new Vector(0, -50));
        });
    }

    getSpeed(){ return this._components[0].getSpeed(); }

    setSpeed(speed){ this._components[0].setSpeed(speed); }

    addForce(force){ this._components[1].addForce(force); }
}
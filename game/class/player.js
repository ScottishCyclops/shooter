class Player extends Entity
{
    constructor(speed = 5)
    {
        super(width / 2, height / 2, meter, meter);

        this.rotation = 0;
        this.forward = createVector(0,  -1);

        this.addComponent(new ZeroGPawnComponent(speed));
        this.addComponent(new PhysicsComponent(0.1, new Vector));

        this.weapons =
        {
            1: new TacticalPistol(0),
            2: new Shotgun(0),
            3: new MachineGun(100)
        };

        this.knife = new Knife();
        this.activeWeapon = this.weapons[3];
        this.kills = 0;
    }
    
    getSpeed(){ return this._components[0].getSpeed(); }

    setSpeed(speed){ this._components[0].setSpeed(speed); }

    addForce(force){ this._components[1].addForce(force); }

    update(delta)
    {
        this.velocity.normalize();

        //speed is relative to the angle between the forward vector and the velocity
        let angle = this.forward.copy().dot(this.velocity);
        this.speed = sqrt(angle + 1) + 2;

        let aim = createVector(mouseX, mouseY);
        this.forward = this.position.copy().sub(aim).normalize().mult(-1);

        let dotVec;
        this.forward.x > 0 ? dotVec = UP_VECTOR : dotVec = DOWN_VECTOR;
        this.rotation = acos(this.forward.copy().dot(dotVec));

        super.update();

        // correct out of bound

        if(this.position.x < 0)
        {
            this.position.x = 0;
        }

        if(this.position.x > width - 1)
        {
            this.position.x = width - 1;
        }

        if(this.position.y < 0)
        {
            this.position.y = 0;
        }

        if(this.position.y > height - 1)
        {
            this.position.y = height - 1;
        }

        for(let i = 1; i <= 3; i++)
        {
            this.weapons[i].update(delta, this.position);
        }

        this.knife.update(delta, this.position);

        for(let i = pickables.length - 1; i >= 0; i--)
        {
            if(this.distanceFrom(pickables[i]) <= this.size)
            {
                switch(pickables[i].type)
                {
                    case "HEALTH": this.health = min(this.health + pickables[i].value, this.maxHealth); break;
                    case "AMMO":   this.activeWeapon.addAmmunition(pickables[i].value);                       break;
                }

                pickables.splice(i, 1);
            }
        }
    }

    draw()
    {
        push();

        fill(0);
        noStroke();

        translate(this.position.x, this.position.y);
        rotate(this.rotation);
        translate(-this.size / 2, -this.size / 2);

        rect(0, 0, this.size, this.size);

        pop();

        this.activeWeapon.draw();
        this.knife.draw();

        //drawing all bullets, even from not the ative weapon
        
        for(let i = 1; i <= 3; i++)
        {
            this.weapons[i].bullets.forEach(function(bullet)
            {
                bullet.draw();
            });
        }
    }

    switchToWeapon(number)
    {
        if(number >= 0 && number <= 3)
        {
            this.activeWeapon = this.weapons[number];
        }
    }

    /*
    MOUVEMENT
    */

    moveUp()
    {
        this.velocity.add(UP_VECTOR);
    }

    moveLeft()
    {
        this.velocity.add(LEFT_VECTOR);
    }

    moveRight()
    {
        this.velocity.add(RIGHT_VECTOR);
    }
    
    moveDown()
    {
        this.velocity.add(DOWN_VECTOR);
    }

    /*
    ABILITIES
    */

    meleeAttack()
    {
        this.knife.swing();
    }

    throwGrenade()
    {
        return;
    }

    reloadWeapon()
    {
        this.activeWeapon.tryReloading();
    }

    useMedkit()
    {
        return;
    }

    tryShooting()
    {
        if(this.knife.canSwing())
        {
            this.activeWeapon.fire(this.forward);
        }
    }
}
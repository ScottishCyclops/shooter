class Player extends Entity
{
    constructor(locX, locY)
    {
        super(locX, locY, { width: 6, height: 6, controlled: true });
        
        /*
        this.weapons =
        {
            1: new TacticalPistol(0),
            2: new Shotgun(0),
            3: new MachineGun(100)
        };

        this.knife = new Knife();
        this.activeWeapon = this.weapons[3];
        */
        this.kills = 0;
    }

    // addForce(force){ this._components[1].addForce(force); }

    update(deltaTime)
    {
        /*

        this.velocity.normalize();

        //speed is relative to the angle between the forward vector and the velocity
        let angle = this.forward.copy().dot(this.velocity);
        this.speed = sqrt(angle + 1) + 2;

        let aim = createVector(mouseX, mouseY);
        this.forward = this.position.copy().sub(aim).normalize().mult(-1);

        let dotVec;
        this.forward.x > 0 ? dotVec = UP_VECTOR : dotVec = DOWN_VECTOR;
        this.rotation = acos(this.forward.copy().dot(dotVec));
        */

        super.update(deltaTime);

        // correct out of bound

        if(this.location.x < 0)
        {
            this.moveTo(0, this.location.y)
        }

        if(this.location.x > width - 1)
        {
            this.moveTo(width - 1, this.location.y);
        }

        if(this.location.y < 0)
        {
            this.moveTo(this.location.x, 0);
        }

        if(this.location.y > height - 1)
        {
            this.moveTo(this.location.x, height - 1);
        }
        /*

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
        */
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

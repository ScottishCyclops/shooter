class Player extends Character
{
    constructor()
    {
        super(width / 2, height / 2, { radius: meter, speed: kmhToMms(5) });
        this.speed = 10 * meter;
        this.backwardsSpeedRatio = 0.7;
        
        this.weapons =
        {
            1: new TacticalPistol(0),
            2: new Shotgun(0),
            3: new MachineGun(100)
        };

        //this.knife = new Knife();
        this.activeWeapon = this.weapons[3];
        this.kills = 0;
        
    }

    update(delta)
    {
        this.forward = this._location.subtract(mousePos).normalize().invert();

        let speed = this.speed * (delta / 1000);

        let dotVec = DOWN_VECTOR;
        if(this.forward.x > 0)
        {
            dotVec = UP_VECTOR;
        }
        this.rotateTo(Math.acos(this.forward.dot(dotVec)));

        if(currentDirections.HORIZONTAL !== "NONE")
        {
            let axisSpeed = 0;
            if(currentDirections.HORIZONTAL === "LEFT")
            {
                //speed is relative to the angle between the forward vector and the motion vector
                axisSpeed = lerp(speed * this.backwardsSpeedRatio, speed, this.forward.dot(LEFT_VECTOR)) * -1;

            }
            else
            {
                axisSpeed = lerp(speed * this.backwardsSpeedRatio, speed, this.forward.dot(RIGHT_VECTOR));
            }

            this.moveBy(axisSpeed, 0);
        }

        if(currentDirections.VERTICAL !== "NONE")
        {
            let axisSpeed = 0;
            if(currentDirections.VERTICAL === "UP")
            {
                // re range from 0-1 to 0.5 1
                axisSpeed = lerp(speed * this.backwardsSpeedRatio, speed, this.forward.dot(UP_VECTOR)) * -1;

            }
            else
            {
                axisSpeed = lerp(speed * this.backwardsSpeedRatio, speed, this.forward.dot(DOWN_VECTOR));
            }

            this.moveBy(0, axisSpeed);
        }

        super.update(delta);

        // TODO: correct out of bound


        /*
        for(let i = 1; i <= 3; i++)
        {
            this.weapons[i].update(delta, this._location);
        }
        
        this.knife.update(delta, this._location);
        */

        for(let i = pickables.length - 1; i >= 0; i--)
        {
            if(collideEntities(pickables[i], this))
            {
                switch(pickables[i].type)
                {
                    case "HEALTH": this.health = min(this.health + pickables[i].value, this._maxHealth); break;
                    case "AMMO":   this.activeWeapon.addAmmunition(pickables[i].value);                  break;
                }

                pickables.splice(i, 1);
            }
        }
    }

    draw()
    {
        /*
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
        // prevent firering while swinging the knife
        if(this.knife.canSwing())
        {
            this.activeWeapon.fire(this.forward);
        }
    }
}

class Zombie extends Actor
{
    constructor(x, y)
    {
        super(x, y, 30);

        this.speed = 2;
        this.maxHealth = randInt(2, 10);
        this.health = this.maxHealth;
        this.target = player.getLocation();
        this.damage = randFloat(0.1, 1.1);
        this.buffed = false;

        this.deadColor = "#2c3e50";
        this.defaultColor = "#f1c40f";
        this.buffedColor = "#16a085";
    }

    updateTarget()
    {
        if(chance(15))
        {
            let newTarget = null;

            if(player.distanceFrom(this) <= this._dim.x * 1.3)
            {
                // if very close, go to player directly
                newTarget = player.getLocation();
            }
            else
            {
                if(chance(15))
                {
                    // go behind player
                    newTarget = player.getLocation().subtract(player.forward.multiply(20));
                }
                else if(chance(10))
                {
                    // go to the side of player, 50% chance for each side
                    newTarget = player.getLocation().add(player.forward.rotate(HALF_PI).multiply(chance(50) ? 20 : -20));
                }
                else if(chance(2))
                {
                    // go to random
                    newTarget = new Vector(randFloat(width), randFloat(height));
                }
                else
                {
                    // go close to player
                    newTarget = player.getLocation().clone();

                    newTarget.x += randFloat(-this._dim.x * 5, this._dim.x * 5);
                    newTarget.y += randFloat(-this._dim.x * 5, this._dim.x * 5);
                }
            }

            this.target = newTarget;
        }
    }

    updateSpeed()
    {
        if(chance(33))
        {
            this.speed = clamp(this.speed + randFloat(-2, 4), 0.5, 4);
        }
    }

    hit(damage)
    {
        this.health -= damage;
        this.speed *= -1;
    }

    update(delta)
    {
        this.updateTarget();

        this._velocity = this.getSteeringVelocity(this.target);

        super.update(delta);

        if(collideEntities(player, this))
        {
            player.health -= this.damage;
        }
        else
        {
            // pickables pickup
            for(let i = pickables.length - 1; i >= 0; i--)
            {
                if(collideEntities(pickables[i], this))
                {
                    switch(pickables[i].type)
                    {
                        case "HEALTH": this.health = min(this.health + pickables[i].value, this.maxHealth); break;
                        case "AMMO":   this.damage++; this.buffed = true;                                   break;
                    }

                    pickables.splice(i, 1);
                }
            }
        }

        this.updateSpeed();

        // TODO: update color
        this.fill(this.defaultColor);
    }

    draw()
    {
        /*
        push();
        // more black as the health goes down

        let fillcolor = lerpColor(color(this.deadColor),
                                  color(this.buffed ? this.buffedColor : this.defaultColor),
                                  this.health / this.maxHealth);
        
        fill(fillcolor);
        noStroke();

        ellipse(this.position.x, this.position.y, this.size);

        pop();
        */
    }

    getSteeringVelocity(target)
    {
        const desiredVelocity = target.subtract(this._location).normalize();

        return desiredVelocity.subtract(this._velocity);
    }
}

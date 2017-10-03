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


class Player extends Actor
{
    constructor()
    {
        super(width / 2, height / 2);
        this.rotation = 0;
        this.forward = createVector(0, -1);
        this.speed = 5;

        this.weapons =
        {
            1: new TacticalPistol(0),
            2: new Shotgun(0),
            3: new MachineGun(100)
        };

        this.knife = new Knife();
        this.activeWeapon = this.weapons[3];
        
    }

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


class Zombie extends Actor
{
    constructor(x, y)
    {
        super(x, y);

        this.speed = 2;
        this.maxHealth = int(random(2, 10));
        this.health = this.maxHealth;
        this.target = player.position.copy();
        this.damage = random(0.2, 1.2);
    }

    changeTarget()
    {
        if(random() < 15 / 100)
        {
            let newTarget;


            if(random() < 10 / 100)
            {
                newTarget = player.position.copy().sub(player.forward.copy().mult(10));
            }
            else if(random() < 1 / 100)
            {
                newTarget = createVector(random(width), random(height));
            }
            else
            {
                newTarget = player.position.copy();

                newTarget.x += random(-this.size * 5, this.size * 5);
                newTarget.y += random(-this.size * 5, this.size * 5);
            }

            this.target = newTarget;
        }
            
    }

    changeSpeed()
    {
        if(random() < 33 / 100)
        {
            this.speed = max(min(this.speed + random(-2, 2), 4), 0);
        }
    }

    hit(damage)
    {
        this.health -= damage;
        this.speed *= -1;
    }

    update()
    {
        this.changeTarget();

        this.changeSpeed();

        this.velocity = this.getSteeringTo(this.target);

        super.update();

        if(this.distanceFrom(player) < player.size)
        {
            player.health -= this.damage;
        }
        else
        {
            for(let i = pickables.length - 1; i >= 0; i--)
            {
                if(this.distanceFrom(pickables[i]) <= this.size)
                {
                    pickables.splice(i, 1);
                }
            }
        }
    }

    draw()
    {
        push();
        //more black as the health goes down
        let fillcolor = lerpColor(color("#2c3e50"), color("#f1c40f"), this.health / this.maxHealth);
        fill(fillcolor);
        noStroke();

        ellipse(this.position.x, this.position.y, this.size);

        pop();

    }

    getSteeringTo(target)
    {
        //+1 to prevent log of 0

        let desiredVelocity = target.copy().sub(this.position).normalize()

        let steering = desiredVelocity.sub(this.velocity);
        return steering;
    }
}

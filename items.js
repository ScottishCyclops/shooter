class Item extends Entity
{
    constructor(name = "unnamed", x = 0, y = 0)
    {
        super(x, y);
        this.name = name;
    }

    draw()
    {
        push();

        noStroke();
        fill(255,0,0);

        ellipse(this.position.x, this.position.y, 7);

        pop();
    }
}

class Bullet extends Item
{
    constructor(position, direction, speed, windResistance = 0.01)
    {
        super("Bullet");

        this.position = position;
        this.direction = direction;
        this.speed = speed;
        this.slope = this.direction.y / this.direction.x;
        this.windResistance = windResistance;
    }

    update()
    {
        this.speed -= this.windResistance;
        this.position.add(this.direction.copy().mult(this.speed));
    }

    isHitting(entity, threshold = 7)
    {
        let hitting = this.distanceFrom(entity) <= threshold;

        if(!hitting)
        {
            let positionToTargetSlope = (entity.position.y - this.position.y) / (entity.position.x - this.position.x);

            //TODO: clean up, remove duplacate
            hitting = abs(positionToTargetSlope - this.slope) <= 2 && this.distanceFrom(entity) <= this.speed*3;
        }

        return hitting;
    }

    needsToBeKilled()
    {
        return !this.isInBound() || this.speed <= 0;
    }
}


class Pickable extends Item
{
    constructor(type, value, x, y)
    {
        super("Pickable " + type, x, y);
        this.type = type;
        this.value = value;
    }

    draw()
    {
        push();

        switch(this.type)
        {
            case "HEALTH": fill("#e74c3c"); break;
            case "AMMO":   fill("#2980b9"); break;
        }

        noStroke();
        ellipse(this.position.x, this.position.y, 6);

        pop();
    }
}


class Knife extends Item
{
    constructor()
    {
        super("Knife");

        /** time between hits, in milliseconds */
        this.cooldown = 1000;

        this.cooldownLeft = 0;
    }

    swing()
    {
        if(this.canSwing())
        {
            //TODO: hit

            push();
            noStroke();
            fill(0,255,0);
            ellipse(this.position.x, this.position.y, 20);
            pop();

            this.cooldownLeft = this.cooldown;
        }
    }

    canSwing()
    {
        return this.cooldownLeft <= 0;
    }

    update(delta, newPosition)
    {
        this.position = newPosition.copy();

        if(this.cooldownLeft > 0)
        {
            this.cooldownLeft -= delta;
        }
    }
}


class Weapon extends Item
{
    constructor(name = "Weapon", ammunition)
    {
        super(name);

        /** time between shots, in milliseconds */
        this.fireCooldown = 250;
        /** how many amunitions can be used before reload */
        this.clipSize = 25;
        /** how much time is needed to reload a clip, in milliseconds */
        this.reloadSpeed = 1000;
        /** the maximum a shot can deviate when shot, between 0-1 */
        this.divergence = 0.05;
        /** the damage dealt by a shot, in heal points */
        this.damage = random(1, 1.5);
        /** the speed at which bullets moves, in px per frame */
        this.speed = 10;

        this.bullets = new Array();
        this.fireCooldownLeft = 0;
        this.ammunition = ammunition;
        this.clip = 0;
        this.isReloading = false;
    }

    fire(direction)
    {
        if(this.canFire())
        {

            let divergence = random(0, this.divergence);
            let divergedDirection = direction.copy().normalize();

            //max 90° of divergence
            let maxDivergence = createVector(direction.y, -direction.x);
            
            //half chance for each side
            if(random() < 50 / 100)
            {
                maxDivergence.mult(-1);
            }

            divergedDirection.add(maxDivergence.mult(divergence));

            this.bullets.push(new Bullet(this.position.copy(), divergedDirection, this.speed));
            this.fireCooldownLeft = this.fireCooldown;
            this.clip--;
        }
    }

    canFire()
    {
        return this.fireCooldownLeft <= 0 && this.clip > 0 && !this.isReloading;
    }

    update(delta, newPosition)
    {
        this.position = newPosition.copy();

        if(!this.canFire())
        {
            if(this.fireCooldownLeft > 0)
            {
                this.fireCooldownLeft-=delta;
            }
        }

        //looping backwards because we may delete elements
        for(let i = this.bullets.length - 1; i >= 0; i--)
        {
            this.bullets[i].update();
            if(this.bullets[i].needsToBeKilled())
            {
                this.bullets.splice(i, 1);
            }
            else
            {
                //hit check for each zombie
                for(let j = 0; j < zombies.length; j++)
                {
                    if(this.bullets[i].isHitting(zombies[j]))
                    {
                        zombies[j].hit(this.damage);
                        //TODO: remove duplication
                        this.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    tryReloading()
    {
        if(this.hasAmmunition())
        {
            if(!this.isReloading)
            {
                this.isReloading = true;
                setTimeout(function(weapon)
                {
                    let newClip = min(weapon.clipSize, weapon.ammunition);
                    weapon.ammunition -= newClip;
                    weapon.clip = newClip;

                    weapon.isReloading = false;
                }, this.reloadSpeed, this);
            }
        }
    }

    draw()
    {
        super.draw();
    }

    addAmmunition(amount)
    {
        this.ammunition += amount;
    }

    hasAmmunition()
    {
        return this.ammunition > 0;
    }
}


class TacticalPistol extends Weapon
{
    constructor(ammunition)
    {
        super("Tactical Pistol", ammunition);

        /** time between shots, in milliseconds */
        this.fireCooldown = 750;
        /** how many amunitions can be used before reload */
        this.clipSize = 10;
        /** how much time is needed to reload a clip, in milliseconds */
        this.reloadSpeed = 250;
        /** the maximum a shot can deviate when shot, between 0-1 */
        this.divergence = 0.01;
        /** the damage dealt by a shot, in heal points */
        this.damage = random(3, 5);
        /** the speed at which bullets moves, in px per frame */
        this.speed = 13;
    }
}


class Shotgun extends Weapon
{
    constructor(ammunition)
    {
        super("Shotgun", ammunition);

        /** time between shots, in milliseconds */
        this.fireCooldown = 2000;
        /** how many amunitions can be used before reload */
        this.clipSize = 8;
        /** how much time is needed to reload a clip, in milliseconds */
        this.reloadSpeed = 3000;
        /** the maximum a shot can deviate when shot, between 0-1 */
        this.divergence = 0.5;
        /** the damage dealt by a shot, in heal points */
        this.damage = random(2, 6);
        /** the speed at which bullets moves, in px per frame */
        this.speed = 8;
    }

    fire(direction)
    {
        if(this.canFire())
        {

            for(let i = 0; i < 5; i++)
            {
                let divergence = random(0, this.divergence);
                let divergedDirection = direction.copy().normalize();

                //max 90° of divergence
                let maxDivergence = createVector(direction.y, -direction.x);
                
                //half chance for each side
                if(random() < 50 / 100)
                {
                    maxDivergence.mult(-1);
                }

                divergedDirection.add(maxDivergence.mult(divergence));

                this.bullets.push(new Bullet(this.position.copy(), divergedDirection, this.speed));
            }

            this.fireCooldownLeft = this.fireCooldown;
            this.clip--;
        }
    }
}


class MachineGun extends Weapon
{
    constructor(ammunition)
    {
        super("Machine Gun", ammunition);

        /** time between shots, in milliseconds */
        this.fireCooldown = 200;
        /** how many amunitions can be used before reload */
        this.clipSize = 40;
        /** how much time is needed to reload a clip, in milliseconds */
        this.reloadSpeed = 300;
        /** the maximum a shot can deviate when shot, between 0-1 */
        this.divergence = 0.04;
        /** the damage dealt by a shot, in heal points */
        this.damage = random(0.5, 1);
        /** the speed at which bullets moves, in px per frame */
        this.speed = 15;
    }
}

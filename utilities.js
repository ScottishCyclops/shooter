class Entity
{
    constructor(x, y)
    {
        this.position = createVector(x, y);
    }

    isInBound()
    {
        return this.position.x >= 0 && this.position.x <= width - 1 && this.position.y >= 0 && this.position.y <= height - 1;
    }

    distanceFrom(entity)
    {
        return this.position.dist(entity.position);
    }

    update()
    {
        return;
    }
}


class Ui
{
    constructor(height)
    {
        this.height = height;
        this.margin = 20;
        this.mainSize = 30;
    }

    draw()
    {
        push();
        noStroke();
        fill(50);
        rect(0, height, width, this.height);

        textSize(this.mainSize);

        //LEFT

        textAlign(LEFT, TOP);

        player.health <= 10 ? fill("#e74c3c") : fill(255);

        text("HP: " + int(player.health), this.margin, height + this.margin);

        if(player.activeWeapon.isReloading)
        {
            fill(255);
            text("Reloading...", this.margin, height + this.margin + this.mainSize + this.margin);
        }
        else
        {
            player.activeWeapon.clip <= 5 ? fill("#e74c3c") : fill(255);
            text("CLIP: " + int(player.activeWeapon.clip), this.margin, height + this.margin + this.mainSize + this.margin);
        }

        //RIGHT

        textAlign(RIGHT, TOP);

        fill(255);

        text(player.activeWeapon.name, width - this.margin, height + this.margin);


        if(!player.activeWeapon.hasAmmunition())
        {
            fill("#e74c3c");
            text("Out of ammo!", width - this.margin, height + this.margin + this.mainSize + this.margin);
        }
        else
        {
            fill(255);
            text("AMMO: " + int(player.activeWeapon.ammunition), width - this.margin, height + this.margin + this.mainSize + this.margin);
        }

        //CENTER

        textAlign(CENTER, BOTTOM);

        fill(255);
        text("WAVE " + wave, width/2, height + this.height/2);
        text("KILLS: " + kills, width/2, height + this.height/2 + this.margin*2);


        pop();
    }
}


function updateKeys(code, pressing)
{
    switch(code)
    {
        case controls["UP"]["CODE"]:      controls["UP"]["DOWN"] =      pressing; break;
        case controls["LEFT"]["CODE"]:    controls["LEFT"]["DOWN"] =    pressing; break;
        case controls["RIGHT"]["CODE"]:   controls["RIGHT"]["DOWN"] =   pressing; break;
        case controls["DOWN"]["CODE"]:    controls["DOWN"]["DOWN"] =    pressing; break;
        case controls["MELEE"]["CODE"]:   controls["MELEE"]["DOWN"] =   pressing; break;
        case controls["GRENADE"]["CODE"]: controls["GRENADE"]["DOWN"] = pressing; break;
        case controls["RELOAD"]["CODE"]:  controls["RELOAD"]["DOWN"] =  pressing; break;
        case controls["HEAL"]["CODE"]:    controls["HEAL"]["DOWN"] =    pressing; break;

        case controls["WEAPON_1"]["CODE"]: player.switchToWeapon(1); break;
        case controls["WEAPON_2"]["CODE"]: player.switchToWeapon(2); break;
        case controls["WEAPON_3"]["CODE"]: player.switchToWeapon(3); break;
    }
    
}


function updateButtons(code, pressing)
{
    switch(code)
    {
        case controls["SHOOT"]["BUTTON"]: controls["SHOOT"]["DOWN"] = pressing; break;
    }
}


function spawnPickable()
{
    if(random() < 20 / 100)
    {
        let type = "AMMO";
        let value = random(10, 50);

        if(random() < 33 / 100)
        {
            type = "HEALTH";
            value = random(5, 30);
        }

        pickables.push(new Pickable(type, int(value), random(width), random(height)));
    }
}


function spawnWave(number)
{
    for(let i = 0; i < number * 3 + 10; i++)
    {
        zombies.push(new Zombie(random(0, -width), random(0, -height)));
    }
}
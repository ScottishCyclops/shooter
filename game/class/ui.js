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
        text("KILLS: " + player.kills, width/2, height + this.height/2 + this.margin*2);


        pop();
    }
}

function spawnPickable()
{
    if(random() < (map(zombies.length, 0, 30, 0, 1) / 100))
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
    for(let i = 0; i < number * 4 + 10; i++)
    {
        zombies.push(new Zombie(random(0, -width), random(0, -height)));
    }
}
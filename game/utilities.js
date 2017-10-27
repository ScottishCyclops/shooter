function spawnPickable()
{
    if(chance(map(zombies.length, 0, 30, 0, 1)))
    {
        let type = "AMMO";
        let value = randFloat(10, 50);

        if(chance(33))
        {
            type = "HEALTH";
            value = random(5, 30);
        }

        pickables.push(new Pickable(type, Math.floor(value), randFloat(width), randFloat(height)));
    }
}

function spawnWave(n)
{
    for(let i = 0; i < n * 4 + 10; i++)
    {
        zombies.push(new Zombie(randFloat(0, -width), randFloat(0, -height)));
    }
}

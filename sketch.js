/*
TODO
more zombie, more loot
noLoop, gameover screen
R for reload

*/

let UP_VECTOR;
let DOWN_VECTOR;
let LEFT_VECTOR;
let RIGHT_VECTOR;

let player;
let controls;
let keysDown;

let pickables;
let pickableEvery;

let zombies;

let delta;
let lastTime;

let uiHeight;
let ui;

let wave;
let kills;


function setup()
{

    uiHeight = 120;
    createCanvas(1280,720+uiHeight);
    height-=uiHeight;

    ui = new Ui(uiHeight);

    UP_VECTOR =    createVector(0, -1);
    DOWN_VECTOR =  createVector(0, 1);
    LEFT_VECTOR =  createVector(-1, 0);
    RIGHT_VECTOR = createVector(1, 0);

    player = new Player();

    controls =
    {
        "UP":       {"CODE": 87, "DOWN": false}, //w
        "LEFT":     {"CODE": 65, "DOWN": false}, //a
        "RIGHT":    {"CODE": 68, "DOWN": false}, //s
        "DOWN":     {"CODE": 83, "DOWN": false}, //d
        "MELEE":    {"CODE": 70, "DOWN": false}, //f
        "GRENADE":  {"CODE": 81, "DOWN": false}, //q
        "RELOAD":   {"CODE": 32, "DOWN": false}, //space
        "HEAL":     {"CODE": 69, "DOWN": false}, //e
        "WEAPON_1": {"CODE": 49}, //1
        "WEAPON_2": {"CODE": 50}, //2
        "WEAPON_3": {"CODE": 51}, //3
        "SHOOT":    {"BUTTON": LEFT, "DOWN": false} //left mouse button
    }

    pickables = new Array();
    pickableEvery = 2000;

    zombies = new Array();
    wave = 1;
    kills = 0;
    spawnWave(wave);

    delta = 0;
    lastTime = 0;

    setInterval(spawnPickable, pickableEvery);
}


function draw()
{
    background(240);

    if(!player.isDead())
    {
        //delta time calculation
        let currentTime = millis();
        delta = currentTime - lastTime;
        lastTime = currentTime;


        if(controls["UP"]["DOWN"])      player.moveUp();
        if(controls["LEFT"]["DOWN"])    player.moveLeft();
        if(controls["RIGHT"]["DOWN"])   player.moveRight();
        if(controls["DOWN"]["DOWN"])    player.moveDown();
        if(controls["MELEE"]["DOWN"])   player.meleeAttack();
        if(controls["GRENADE"]["DOWN"]) player.throwGrenade();
        if(controls["RELOAD"]["DOWN"])  player.reloadWeapon();
        if(controls["HEAL"]["DOWN"])    player.useMedkit();
        if(controls["SHOOT"]["DOWN"])   player.tryShooting();

        player.update(delta);

        for(let i = zombies.length - 1; i >= 0; i--)
        {
            zombies[i].update();

            if(zombies[i].isDead())
            {
                zombies.splice(i, 1);
                kills++;
            }
            else
            {
                zombies[i].draw();
            }
        }

        pickables.forEach((pickable) =>
        {
            pickable.draw();
        });

        player.draw();

        ui.draw();

        if(zombies.length === 0)
        {
            wave++;
            spawnPickable();
            spawnWave(wave);
        }
    }
}


function keyPressed()
{
    updateKeys(keyCode, true);
}


function keyReleased()
{
    updateKeys(keyCode, false);
}


function mousePressed()
{
    updateButtons(mouseButton, true);
}


function mouseReleased()
{
   updateButtons(mouseButton, false);
}

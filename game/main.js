/*
TODO
more zombie, more loot
noLoop, gameover screen
R for reload

*/


// constantes
const pickableEvery = 2000;
const uiHeight = 120;

const width = window.innerWidth;
const height = window.innerHeight // - uiHeight;

let canvas = null;

// classes
let player, kb, ui;

let pickables = [];
let zombies = [];
let wave;


function setup()
{
    canvas = new Canvas(window.innerWidth, window.innerHeight);
    canvas.setColor("#ccc");

    player = new Actor(width / 2, height / 2,
    {
        controlled: true,
        keepInBounds: true,
        speed: kmhToMms(80),
        origin: origin.CENTER
    });

    player.setColor("#333");
    canvas.appendChild(player);

    //kb = new Input();
    //ui = new Ui(uiHeight);

    //wave = 1;
    //spawnWave(wave);
}


function loop()
{
    player.rotateBy(degreesToRadian(12));
    /*

    spawnPickable();

    if(!player.isDead())
    {
        // delta time calculation
        let currentTime = millis();
        delta = currentTime - lastTime;
        lastTime = currentTime;


        if(kb.controls["UP"]["DOWN"])      player.moveUp();
        if(kb.controls["LEFT"]["DOWN"])    player.moveLeft();
        if(kb.controls["RIGHT"]["DOWN"])   player.moveRight();
        if(kb.controls["DOWN"]["DOWN"])    player.moveDown();
        if(kb.controls["SHOOT"]["DOWN"])   player.tryShooting();

        player.update(delta);

        // process every zombie
        for(let i = zombies.length - 1; i >= 0; i--)
        {
            zombies[i].update();

            if(zombies[i].isDead())
            {
                zombies.splice(i, 1);
                player.kills++;
            }
            else
            {
                zombies[i].draw();
            }
        }

        // draw all pickables
        pickables.forEach(pickable =>
        {
            pickable.draw();
        });

        player.draw();

        ui.draw();

        if(zombies.length === 0)
        {
            // TODO: warn for next wave, give loot ?
            wave++;
            spawnPickable();
            spawnWave(wave);
        }
    }
    else
    {
        // end of the game
        noLoop();
        console.log("Game over");
        // clear zombies
        zombies = null;
    }
    */
}

/*
function keyPressed()
{
    kb.updateKeys(keyCode, true);
}


function keyReleased()
{
    kb.updateKeys(keyCode, false);
}


function mousePressed()
{
    kb.updateButtons(mouseButton, true);
}


function mouseReleased()
{
   kb.updateButtons(mouseButton, false);
}
*/
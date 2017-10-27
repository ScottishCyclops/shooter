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

let transition = null;
let transitionTimout = null;

let world, camera;

// classes
let player, kb, ui;

let pickables = [];
let zombies = [];
let wave;


function setup()
{
    world = new Container;
    camera = new Container;

    player = new Actor(width / 2, height / 2,
    {
        width: 128,
        height: 128,
        controlled: false,
        keepInBounds: false,
        speed: kmhToMms(30),
        origin: origin.TOPLEFT,
        spritePath: "res/player2.gif",
        depth: 10
    });

    camera.appendChild(world);
    camera.appendChild(player);
    canvas.appendChild(camera);

    createWorld();

    // player.setColor("#333");

    //kb = new Input();
    //ui = new Ui(uiHeight);

    //wave = 1;
    //spawnWave(wave);
}


function loop(deltaTime)
{
    const speed = player.speed * deltaTime * meter * -1;

    if(currentDirections.HORIZONTAL !== "NONE")
    {
        if(currentDirections.HORIZONTAL === "LEFT")
        {
            world.moveBy(-speed, 0);
        }
        else
        {
            world.moveBy(speed, 0);
        }
    }
    else
    {
        // camera.moveTo(0, 0);
    }

    document.title = (1000 / deltaTime).toFixed(1);

    // player.rotateBy(degreesToRadian(12));

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

function changedDirection()
{
    if(transition !== null)
    {
        transition.stop(false);
    }

    if(currentDirections.HORIZONTAL === "NONE")
    {
        transitionTimout = setTimeout(() =>
        {
            transition = new Transition(amount =>
            {
                camera.moveBy(amount, 0);
            }, -camera.location.x, 1000);
        }, 500);

        return;
    }

    clearTimeout(transitionTimout);

    if(currentDirections.HORIZONTAL === "LEFT")
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x + 300, 750);

        player.scaleTo(-1, 1);
    }
    else
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x - 300, 750);

        player.scaleTo(1, 1);
    }
}

function createWorld()
{
    const box1 = new Entity(-1000, player.location.y + 200, {width: 2000, height: 30, color: "green", useCollisions: true});
    const box2 = new Entity(30, player.location.y, {width: 30, height: 30, color: "red", useCollisions: true});
    world.appendChild(box1);
    world.appendChild(box2);
}

const width = window.innerWidth;
const height = window.innerHeight;

let transition = null;
let transitionTimout = null;

let world, camera, player;
let box1, box2;

function setup()
{
    canvas.setColor("#222");

    box1 = new Entity(10, 20, { width: meter * 2, height: meter * 4, color: "#DDD" });
    box2 = new Entity(40, 10, { width: meter * 4, height: meter * 2, color: "#AAA" });

    player = new Actor(innerWidth / 2, innerHeight / 2, { color: "orange" });


    canvas.appendChild(box1).appendChild(box2).appendChild(player);

    //#region data
    /*
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
    */
    //#endregion
}

function mouseUpEvent(e)
{
    /*
    box2.moveTo(mousePos);
    console.log(overlaps(box1, box2));
    */
}


function loop(deltaTime)
{
    // document.title = (1000 / deltaTime).toFixed(1);
}

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

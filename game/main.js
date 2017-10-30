let transition = null;
let transitionTimout = null;

let world, camera, player;
let box1, box2;

let dataBox;

let currentDirection = "NONE";

const cameraOffset = 300;

function setup()
{
    canvas.setColor("#222");

    dataBox = new TextEntity(innerWidth / 2, 10, {color: "white", family: "monospace", size: 20});
    world = new Container;
    camera = new Container;

    player = new Actor(innerWidth / 2, innerHeight / 2,
    {
        width: 64,
        height: 120,
        sprite: "res/spaceguy/still.gif",
        depth: 5,
        useCollisions: true,
        inputs:
        {
            LEFT:  "a",
            RIGHT: "d",
            UP:    "w",
            DOWN:  "s",
            JUMP:  " "
        },
        //color: "#0005",
        walkingSpeed: 3
    });

    camera.appendChild(world).appendChild(player);
    canvas.appendChild(camera).appendChild(dataBox);

    createWorld();
}

function keyDownEvent(key)
{
    const oldDirection = currentDirection;

    if(key === player.inputs.LEFT)
    {
        currentDirection = "LEFT";
    }
    if(key === player.inputs.RIGHT)
    {
        currentDirection = "RIGHT";
    }

    if(currentDirection !== oldDirection)
    {
        changedDirection();
    }
}

function keyUpEvent(key)
{
    const oldDirection = currentDirection;

    if(key === player.inputs.LEFT)
    {
        if(!isDown(player.inputs.RIGHT))
        {
            currentDirection = "NONE";
        }
        else
        {
            currentDirection = "RIGHT";
        }
    }
    if(key === player.inputs.RIGHT)
    {
        if(!isDown(player.inputs.LEFT))
        {
            currentDirection = "NONE";
        }
        else
        {
            currentDirection = "LEFT";
        }
    }

    if(currentDirection !== oldDirection)
    {
        changedDirection();
    }
}

function loop(deltaTime)
{
    dataBox.setText(
        `FPS      ${Math.floor(1000 / deltaTime)}\n`,
        `VELOCITY ${player.velocity}\n`,
        `STATE    ${player.state}\n`,
        `TOP      ${player.top}\n`,
        `RIGHT    ${player.right}\n`,
        `BOTTOM   ${player.bottom}\n`,
        `LEFT     ${player.left}\n`,
        `JUMP     ${player.jumpPressingTime}\n`
    );
}

function changedDirection()
{
    if(transition !== null)
    {
        transition.stop(false);
    }

    if(currentDirection === "NONE")
    {
        // move the camera back to the center
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

    if(currentDirection === "LEFT")
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x + cameraOffset, 750);

        player.scaleTo(-1, 1);
    }
    else
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x - cameraOffset, 750);

        player.scaleTo(1, 1);
    }
}

function createWorld()
{
    const box1 = new Entity(0, 200, {width: 300, height: 200, color: "#888", useCollisions: true});
    const box2 = new Entity(30, innerHeight - 400, {width: 30, height: 200, color: "#542", useCollisions: true});
    const box3 = new Entity(900, innerHeight - 400, {width: 30, height: 200, color: "#333", useCollisions: true});
    const box4 = new Entity(-1000, innerHeight - 200, {width: 2000, height: 200, color: "#DDD", useCollisions: true});
    world.appendChild(box1).appendChild(box2).appendChild(box3).appendChild(box4);
}

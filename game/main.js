"use strict"

let transition = null;
let transitionTimout = null;

let world, camera, player, background, dataBox;

let currentDirection = "NONE";

const cameraOffset = 300;

function setup()
{
    canvas.setColor("#222");

    world = new Container;
    camera = new Container;

    background = new Background(innerWidth / -2, innerHeight / -2,
    {
        sprite: "res/background1.png",
        width: innerWidth * 1.5,
        height: innerHeight * 1.5,
        distanceDivider: 5
    });

    dataBox = new TextEntity(innerWidth / 2, 10,
    {
        color: "white",
        family: "monospace",
        size: 20,
        depth: 30
    });

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

    // TODO: append background to world
    camera.appendChild(world).appendChild(player).appendChild(background);
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
        `TOP      ${player.top}\n`,
        `RIGHT    ${player.right}\n`,
        `BOTTOM   ${player.bottom}\n`,
        `LEFT     ${player.left}\n`,
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
    const core = new Entity(-2000, innerHeight, {width: 4000, height: 500, color: "red", useCollisions: true});
    const rock1 = new Entity(-2000, innerHeight - 400, {width: 2000, height: 400, color: "grey", useCollisions: true});
    const rock2 = new Entity(300, innerHeight - 500, {width: 1700, height: 350, color: "grey", useCollisions: true});
    const dirt1 = new Entity(-2000, innerHeight - 900, {width: 1000, height: 500, color: "green", useCollisions: true});
    const dirt2 = new Entity(-750, innerHeight - 900, {width: 2250, height: 350, color: "green", useCollisions: true});
    world.appendChild(core).appendChild(rock1).appendChild(rock2).appendChild(dirt1).appendChild(dirt2);
}

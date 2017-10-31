"use strict"

let transition = null;
let transitionTimout = null;

let world, camera, player, background, dataBox;

const directions =
{
    "NONE": -1,
    "UP":    0,
    "RIGHT": 1,
    "DOWN":  2,
    "LEFT":  3
};

const currentDirections =
{
    HORIZONTAL: directions.NONE,
    VERTICAL: directions.NONE
};

const cameraOffset =     300;
const cameraOffsetTime = 750;
const cameraBackTime =   500;
const cameraBackDelay =  1000;

const ladders = [];

function setup()
{
    canvas.setColor("#222");

    world = new Container;
    camera = new Container;

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
        inputs:
        {
            UP:    "w",
            RIGHT: "d",
            DOWN:  "s",
            LEFT:  "a",
            JUMP:  " "
        },
        color: "#0005",
        walkingSpeed: 3
    });

    camera.appendChild(world).appendChild(player);
    canvas.appendChild(camera).appendChild(dataBox);

    readFile("level.json", data =>
    {
        parseLevel(data);
    });

    // pause or play the game
    addInputEvent("escape", false, false, () =>
    {
        if(looping)
        {
            dataBox.setText("PAUSED");
            pause();
        }
        else
        {
            play();
        }
    });

    window.onblur = pause;
    window.onfocus = play;
}

function keyDownEvent(key)
{
    // horizontal
    const oldDirection = currentDirections.HORIZONTAL;

    if(key === player.inputs.LEFT)
    {
        currentDirections.HORIZONTAL = directions.LEFT;
    }
    else if(key === player.inputs.RIGHT)
    {
        currentDirections.HORIZONTAL = directions.RIGHT;
    }

    if(currentDirections.HORIZONTAL !== oldDirection)
    {
        changedDirection();
    }

    // vertical
    if(key === player.inputs.UP)
    {
        currentDirections.VERTICAL = directions.UP;
    }
    else if(key === player.inputs.DOWN)
    {
        currentDirections.VERTICAL = directions.DOWN;
    }
}

function keyUpEvent(key)
{
    // horizontal
    const oldDirection = currentDirections.HORIZONTAL;

    if(key === player.inputs.LEFT)
    {
        if(!isDown(player.inputs.RIGHT))
        {
            currentDirections.HORIZONTAL = directions.NONE;
        }
        else
        {
            currentDirections.HORIZONTAL = directions.RIGHT;
        }
    }
    if(key === player.inputs.RIGHT)
    {
        if(!isDown(player.inputs.LEFT))
        {
            currentDirections.HORIZONTAL = directions.NONE;
        }
        else
        {
            currentDirections.HORIZONTAL = directions.LEFT;
        }
    }

    if(currentDirections.HORIZONTAL !== oldDirection)
    {
        changedDirection();
    }

    // vertical
    if(key === player.inputs.UP)
    {
        if(!isDown(player.inputs.DOWN))
        {
            currentDirections.VERTICAL = directions.NONE;
        }
        else
        {
            currentDirections.VERTICAL = directions.DOWN;
        }
    }
    else if(key === player.inputs.DOWN)
    {
        if(!isDown(player.inputs.UP))
        {
            currentDirections.VERTICAL = directions.NONE;
        }
        else
        {
            currentDirections.VERTICAL = directions.UP;
        }
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
        `TIMEDIV  ${timeDivider}\n`
    );
}

function changedDirection()
{
    if(transition !== null)
    {
        transition.stop(false);
    }

    if(currentDirections.HORIZONTAL === directions.NONE)
    {
        // move the camera back to the center
        transitionTimout = setTimeout(() =>
        {
            transition = new Transition(amount =>
            {
                camera.moveBy(amount, 0);
            }, -camera.location.x, cameraBackTime);
        }, cameraBackDelay);

        return;
    }

    clearTimeout(transitionTimout);

    if(currentDirections.HORIZONTAL === directions.LEFT)
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x + cameraOffset, cameraOffsetTime);

        player.scaleTo(-1, 1);
    }
    else
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x - cameraOffset, cameraOffsetTime);

        player.scaleTo(1, 1);
    }
}

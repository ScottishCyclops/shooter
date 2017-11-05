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

let fps = [];
let avgFps = 0;
let lowest = Infinity;
let maxHeight = 999;

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

    // TODO: add actions at player creation
    player = new Actor(innerWidth / 2, innerHeight / 2,
    {
        width: 64,
        height: 120,
        depth: 5,
        inputs:
        {
            UP:    "w",
            RIGHT: "d",
            DOWN:  "s",
            LEFT:  "a",
            JUMP:  " "
        },
        // color: "#0005",
        walkingSpeed: 0.6
    });


    player.addActions(
        new Action("res/anims/spaceguy/still", 2, {delay: 750, iterations: -1}),
        new Action("res/anims/spaceguy/walk",  2, {delay: 250, iterations: -1}),
        new Action("res/anims/spaceguy/land",  2, {delay: 100}),
        new Action("res/anims/spaceguy/jump",  2, {delay: 75}),
        new Action("res/anims/spaceguy/fly",   1, {delay: 1, iterations: -1})
    );

    player.playAction("fly");

    camera.appendChild(world).appendChild(player);
    canvas.appendChild(camera).appendChild(dataBox);

    pause();
    readFile("level.json", data =>
    {
        parseLevel(data);
        play();
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

    // window.onblur = pause;
    // window.onfocus = play;
}

function loop(deltaTime)
{
    fps.push(Math.floor(1000 / deltaTime));

    if(fps.length >= 20)
    {
        let total = 0;
        lowest = Infinity;
        fps.forEach(value =>
        {
            total += value;

            if(value < lowest)
            {
                lowest = value;
            }
        });

        avgFps = setPrecision(total / fps.length, 1);

        fps = [];
    }

    dataBox.setText(
        `AVG FPS          ${avgFps}\n`,
        `LOWEST FPS       ${lowest}\n`,
        `VELOCITY/MS      ${player.velocity.divide(deltaTime)}\n`,
        `ACCELERATION/MS  ${player.acceleration.divide(deltaTime)}\n`,
        `DELTA            ${deltaTime}\n`
    );
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

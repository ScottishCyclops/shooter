/// <reference path="../typings/pixi.js.d.ts" />
"use strict"

const scale = 4;
const toLoad =
[
    {name: "still0", url:"res/anims/spaceguy/still/0.png"},
    {name: "still1", url:"res/anims/spaceguy/still/1.png"},
    {name: "walk0",  url:"res/anims/spaceguy/walk/0.png"},
    {name: "walk1",  url:"res/anims/spaceguy/walk/1.png"},
    {name: "land0",  url:"res/anims/spaceguy/land/0.png"},
    {name: "land1",  url:"res/anims/spaceguy/land/1.png"},
    {name: "jump0",  url:"res/anims/spaceguy/jump/0.png"},
    {name: "jump1",  url:"res/anims/spaceguy/jump/1.png"},
    {name: "fly0",   url:"res/anims/spaceguy/fly/0.png"},
    {name: "black",  url: "res/black.png"}
];

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
    // make all pixel art sharp
    for(const img in res)
    {
        res[img].texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

    renderer.backgroundColor = 0x222222;

    world = new Container;
    camera = new Container;
    /*
    dataBox = new TextEntity(innerWidth / 2, 10,
    {
        color: "white",
        family: "monospace",
        size: 20,
        depth: 30
    });
    */

    // TODO: add actions at player creation
    player = new Actor(innerWidth / 2, innerHeight / 2, res["fly0"],
    {
        scale: scale,
        anchorX: 0.5,
        inputs:
        {
            UP:    "w",
            RIGHT: "d",
            DOWN:  "s",
            LEFT:  "a",
            JUMP:  " "
        },
        walkingSpeed: 0.7
    });


    player.addActions(
        new Action("still", 2, {delay: 750, iterations: -1}),
        new Action("walk",  2, {delay: 250, iterations: -1}),
        new Action("land",  2, {delay: 100}),
        new Action("jump",  2, {delay: 75}),
        new Action("fly",   1, {delay: 1, iterations: -1})
    );

    // player.pauseAction = true;

    player.playAction("fly");

    camera.appendChild(world).appendChild(player);

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
            // dataBox.setText("PAUSED");
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
    /*
    dataBox.setText(
        `AVG FPS          ${avgFps}\n`,
        `LOWEST FPS       ${lowest}\n`,
        `VELOCITY/MS      ${player.velocity.divide(deltaTime).toPaddedString(4, 1)}\n`,
        `ACCELERATION/MS  ${player.acceleration.divide(deltaTime).toPaddedString(4, 1)}\n`,
        `DELTA            ${deltaTime}\n`,
        `JUMPING          ${player.jumping}\n`
    );
    */
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

        player.scaleTo(-scale, scale);
    }
    else
    {
        transition = new Transition(amount =>
        {
            camera.moveBy(amount, 0);
        }, -camera.location.x - cameraOffset, cameraOffsetTime);

        player.scaleTo(scale, scale);
    }
}

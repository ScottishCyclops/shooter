"use strict"

const keysDown = [];
let interval = 1000 / 60;

//one meter is x pixels
const meter = 40;

let loopHandle = undefined;
let loopFunction = undefined;
const startTime = Date.now();

const directionKeys =
{
    LEFT:  "a",
    RIGHT: "d",
    UP:    "w",
    DOWN:  "s",
};

const currentDirections =
{
    HORIZONTAL: "NONE",
    VERTICAL: "NONE",
};
const UP_VECTOR = new Vector(0, -1);
const DOWN_VECTOR = new Vector(0, 1);
const LEFT_VECTOR = new Vector(-1, 0);
const RIGHT_VECTOR = new Vector(1, 0);

const inputEvents = {};

const entities = [];

window.onload = () =>
{
    let lastTime = startTime;
    
    loopFunction = () =>
    {
        const now = Date.now();
        const delta = now - lastTime;
        lastTime = now;

        if(typeof loop === "function")
        {
            loop(delta);
        }

        entities.forEach(entity =>
        {
            entity.updateComponents(delta);
        });
    };
    loopHandle = setInterval(loopFunction, interval);

    //Events

    document.onmousedown = e =>
    {
        if(typeof mouseDownEvent === "function")
        {
            //if it returns anything, we cancel the event
            if(mouseDownEvent(e))
            {
                return false;
            }
        }
    };

    document.onmouseup = e =>
    {
        if(typeof mouseUpEvent === "function")
        {
            //if it returns anything, we cancel the event
            if(mouseUpEvent(e))
            {
                return false;
            }
        }
    };

    document.onkeydown = e =>
    {
        const key = e.key.toLowerCase();

        const index = keysDown.indexOf(key);
        if(index === -1)
        {
            keysDown.push(key);
        }

        if(key === directionKeys.LEFT)
        {
            currentDirections.HORIZONTAL = "LEFT";
        }
        if(key === directionKeys.RIGHT)
        {
            currentDirections.HORIZONTAL = "RIGHT";
        }
        if(key === directionKeys.UP)
        {
            currentDirections.VERTICAL = "UP";
        }
        if(key === directionKeys.DOWN)
        {
            currentDirections.VERTICAL = "DOWN";
        }

        if(inputEvents[key] !== undefined)
        {
            if(!inputEvents[key].release)
            {
                inputEvents[key].callback();
            }
        }
        

        if(typeof keyDownEvent === "function")
        {
            if(keyDownEvent(e))
            {
                return false;
            }
        }
    };

    document.onkeyup = e =>
    {
        const key = e.key.toLowerCase();

        const index = keysDown.indexOf(key);
        if(index !== -1)
        {
            keysDown.splice(index, 1);
        }

        
        if(key === directionKeys.LEFT)
        {
            if(!isDown(directionKeys.RIGHT))
            {
                currentDirections.HORIZONTAL = "NONE";
            }
            else
            {
                currentDirections.HORIZONTAL = "RIGHT"; 
            }
        }
        if(key === directionKeys.RIGHT)
        {
            if(!isDown(directionKeys.LEFT))
            {
                currentDirections.HORIZONTAL = "NONE";
            }
            else
            {
                currentDirections.HORIZONTAL = "LEFT"; 
            }
        }
        if(key === directionKeys.UP)
        {
            if(!isDown(directionKeys.DOWN))
            {
                currentDirections.VERTICAL = "NONE";
            }
            else
            {
                currentDirections.VERTICAL = "DOWN"; 
            }
        }
        if(key === directionKeys.DOWN)
        {
            if(!isDown(directionKeys.UP))
            {
                currentDirections.VERTICAL = "NONE";
            }
            else
            {
                currentDirections.VERTICAL = "UP"; 
            }
        }

        if(inputEvents[key] !== undefined)
        {
            if(inputEvents[key].release)
            {
                inputEvents[key].callback();
            }
        }

        if(typeof keyUpEvent === "function")
        {
            if(keyUpEvent(e))
            {
                return false;
            }
        }
    };

    //user setup
    if(typeof setup === "function")
    {
        setup()
    }
}

//Helpers

function setFrameRate(frameRate)
{
    interval = 1000 / frameRate;

    clearInterval(loopHandle);
    loopHandle = setInterval(loopFunction, interval);
}

function addInputEvent(key, release, once, callback)
{
    inputEvents[key] = { release: release, callback: () =>
    {
        callback();
        if(once)
        {
            removeInputEvent(key);
        }
    }};
}

function removeInputEvent(key)
{
    inputEvents[key] = undefined;
}

function isDown(id)
{
    return keysDown.indexOf(id) !== -1;
}

function wasPressedBefore(id1, id2)
{
    const index1 = keysDown.indexOf(id1);
    const index2 = keysDown.indexOf(id2);
    return  index1 === -1 ? 999 : index1 < index2 === -1 ? 999 : index2;
}

function millis()
{
    return Date.now() - startTime;
}


function registerEntity(entity)
{
    if(!entities.includes(entity))
    {
        entities.push(entity);
    }
}

function unregisterEntity(entity)
{
    const i = entities.indexOf(entity);
    if(i !== -1)
    {
        entities.splice(i, 1);
    }
}
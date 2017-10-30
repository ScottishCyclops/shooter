"use strict"

const keysDown = [];
let interval = 1000 / 60;

//one meter is x pixels
const meter = 64;

let loopHandle = undefined;
let loopFunction = undefined;
let looping = false;
const startTime = Date.now();

let mouseX = 0, mouseY = 0;
let mousePos = new Vector(0, 0);

const UP_VECTOR = new Vector(0, -1);
const DOWN_VECTOR = new Vector(0, 1);
const LEFT_VECTOR = new Vector(-1, 0);
const RIGHT_VECTOR = new Vector(1, 0);
const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

const collideMethods =
{
    BOX: 0,
    CIRCLE: 1
};

const inputEvents = {};

const entities = [];
const objects = [];

let canvas = null;

window.onload = () =>
{
    canvas = new Canvas(innerWidth, innerHeight);

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
            entity.update(delta);
        });

        objects.forEach(object =>
        {
            object.update(delta);
        });
    };
    // TODO: use while ?
    loopHandle = setInterval(loopFunction, 0);
    looping = true;

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

        if(inputEvents[key] !== undefined)
        {
            if(!inputEvents[key].release)
            {
                inputEvents[key].callback();
            }
        }

        if(typeof keyDownEvent === "function")
        {
            if(keyDownEvent(key))
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

        if(inputEvents[key] !== undefined)
        {
            if(inputEvents[key].release)
            {
                inputEvents[key].callback();
            }
        }

        if(typeof keyUpEvent === "function")
        {
            if(keyUpEvent(key))
            {
                return false;
            }
        }
    };

    document.onmousemove = e =>
    {
        mouseX = e.clientX;
        mouseY = e.clientY;

        mousePos = new Vector(mouseX, mouseY);

        if(typeof mouseMoveEvent === "function")
        {
            return mouseMoveEvent(e);
        }
    }

    // user setup
    if(typeof setup === "function")
    {
        setup()
    }
}

// Helpers

function noLoop()
{
    looping = false;
    clearInterval(loopHandle);
    loopHandle = null;
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
    delete inputEvents[key];
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


function registerObject(object)
{
    if(object instanceof Entity)
    {
        if(!entities.includes(object))
        {
            entities.push(object);
        }
    }
    else
    {
        if(!objects.includes(object))
        {
            objects.push(object);
        }
    }
}

function unregisterObject(object)
{
    if(object instanceof Entity)
    {
        const i = entities.indexOf(object);
        if(i === -1)
        {
            return;
        }

        entities.splice(i, 1);
    }
    else
    {
        const i = objects.indexOf(object);
        if(i === -1)
        {
            return;
        }

        objects.splice(i, 1);
    }
}

function randFloat(min, max)
{
    if(max === undefined)
    {
        // assume max was given if only one param
        return Math.random() * min;
    }
    else
    {
        return Math.random() * (max - min) + min;
    }
}

function randInt(min, max)
{
    return Math.floor(randFloat(min, max));
}

function map(value, inMin, inMax, outMin, outMax)
{
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

/**
 * Returns true `pourcent`% of the time
 *
 * @param {number} pourcent
 */
function chance(pourcent)
{
    pourcent = clamp(pourcent, 0, 100);

    return Math.random() < pourcent / 100;
}

function lerp(x, y, alpha)
{
    return (1 - alpha) * x + alpha * y;
}

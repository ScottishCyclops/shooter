// one meter is x pixels
const meter = 64;
const startTime = Date.now();
let loopHandle = undefined;
let loopFunction = undefined;
let looping = false;
let mousePos = ZERO_VECTOR
let canvas = null;

const UP_VECTOR = new Vector(0, -1);
const DOWN_VECTOR = new Vector(0, 1);
const LEFT_VECTOR = new Vector(-1, 0);
const RIGHT_VECTOR = new Vector(1, 0);
const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

const inputEvents = {};
const keysDown = [];
const entities = [];
const objects = [];

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

    // Events

    document.onmousedown = e =>
    {
        if(typeof mouseDownEvent === "function")
        {
            // if it returns anything, we cancel the event
            return mouseDownEvent(e);
        }
    };

    document.onmouseup = e =>
    {
        if(typeof mouseUpEvent === "function")
        {
             return mouseUpEvent(e);
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
            return keyDownEvent(key);
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
            return keyUpEvent(key);
        }
    };

    document.onmousemove = e =>
    {
        mousePos = new Vector(e.clientX, e.clientY);

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

/**
 * Stop the update looping
 */
function noLoop()
{
    looping = false;
    clearInterval(loopHandle);
    loopHandle = null;
}

/**
 * Add an input event
 * @param {string} key the key for which to call back
 * @param {boolean} release should the callback be when the key is released
 * @param {boolean} once should the callback only happen once
 * @param {Function} callback the function to call
 */
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

/**
 * Remove an input event
 * @param {string} key the key for which to clear the event
 */
function removeInputEvent(key)
{
    delete inputEvents[key];
}

/**
 * Returns whether or not the provided key is currently pressed or not
 * @param {string} key the key to check
 * @return {boolean} true if the key is currently beeing pressed
 */
function isDown(key)
{
    return keysDown.indexOf(key) !== -1;
}

/**
 * Checks if `key1` was pressed before `key2` or not
 * @param {string} key1 the first key
 * @param {string} key2 the second key
 * @return {boolean} true if `key1` was pressed before `key2`
 */
function wasPressedBefore(key1, key2)
{
    const index1 = keysDown.indexOf(key1);
    const index2 = keysDown.indexOf(key2);
    return  index1 === -1 ? 999 : index1 < index2 === -1 ? 999 : index2;
}

/**
 * Returns the current time in milliseconds since the program started
 * @return {number} the number of milliseconds
 */
function millis()
{
    return Date.now() - startTime;
}

/**
 * Adds an object to the registered list to be updated every frame
 * 
 * Determines if it is an Entity or any other object
 * @param {any} object the object to register
 */
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

/**
 * Removes an object from the registered list
 * @param {any} object the object to remove
 */
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

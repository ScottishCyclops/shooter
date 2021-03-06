const DEGREES = 180 / Math.PI;
const PX = "px";
const GRAVITY = 0.15;
const DRAG = 0.02;

/**
 * Converts a radian angle to a degree angle
 * @param {number} rad the angle in raadians
 * @return {number} the angle in degrees
 */
function radianToDegrees(rad)
{
    return rad * DEGREES;
}

/**
 * Converts a degree angle to a radian angle
 * @param {number} deg the angle in degrees
 * @return {number} the angle in radians
 */
function degreesToRadian(deg)
{
    return deg / DEGREES;
}

/**
 * Returns a pseudo-random integer between the given extrems
 * @param {number} min minimum value, inclusive, or maximum if only parameter
 * @param {number} max maximum value, exclusive, or undefined
 * @return {number} the pseudo-random number
 */
function randInt(min, max)
{
    return Math.floor(randFloat(min, max));
}

/**
 * Returns a pseudo-random floating point between the given extrems
 * @param {number} min minimum value, inclusive, or maximum if only parameter
 * @param {number} max maximum value, exclusive, or undefined
 * @return {number} the pseudo-random number
 */
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

/**
 * Maps a value from the `in` range to the `out` range
 * @param {number} value the value to map
 * @param {number} inMin the first point for in
 * @param {number} inMax the second point for in
 * @param {number} outMin the first point for out
 * @param {number} outMax the second point for out
 * @return {number} the mapped value
 */
function map(value, inMin, inMax, outMin, outMax)
{
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

/**
 * Limits the given value within the given min and max
 * @param {number} value the value to clamp
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @return {number} the clamped value
 */
function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

/**
 * Returns true `pourcent`% of the time
 * @param {number} pourcent
 * @return {boolean} true of false pseudo-randomly based on the pourcentage
 */
function chance(pourcent)
{
    pourcent = clamp(pourcent, 0, 100);

    return Math.random() < pourcent / 100;
}

/**
 * Performs a linear interpolation between x and y based on alpha
 * @param {number} x the first value
 * @param {number} y the second value
 * @param {number} alpha the amount of blend (0 returns x, 1 returns y)
 * @return {number} the lerped value
 */
function lerp(x, y, alpha)
{
    return (1 - alpha) * x + alpha * y;
}


/**
 * Converts kilometers per hour to meters per millisecond
 * @param {number} kilometers speed in khm
 * @return {number} the speed in meters per millisecond
 */
function kmhToMms(kilometers)
{
    return kilometers / 3600
}

/**
 * Converts meters per second to meters per millisecond
 * @param {number} meters speed in ms
 * @return {number} the speed in meters per millisecond
 */
function msToMms(meters)
{
    return meters / 1000;
}

/**
 * Converts meters per millisecond in meters per second
 * @param {number} millimeters
 * @return {number} the speed in meters per second
 */
function mmsToMs(meters)
{
    return meters * 1000;
}

/**
 * Converts meters per millisecond in kilometers per hour
 * @param {number} meters
 * @return {number} the speed in kilometers per hour
 */
function mmsToKhm(meters)
{
    return meters * 3600;
}

/**
 * Sets the precision of the given number
 * @param {number} number the number on which to set the precision
 * @param {number} decimals the number of decimals points to leave
 * @return {number} the given number with the given precision
 */
function setPrecision(number, decimals)
{
    if(decimals <= 0)
    {
        return number;
    }

    const multiplier = Math.pow(10, decimals);
    const rounded = Math.floor(Math.abs(number) * multiplier) / multiplier;

    // apply back the sign
    if(number < 0)
    {
        return -rounded;
    }

    return rounded;
}

// TODO: support multichar pattern for padding
/**
 * Aligns `n` on the left by adding a maximum of `amount` `char` on its right
 * @param {any} n the string or number to align
 * @param {string} char the char to use to align
 * @param {number} amount the maximum length of the returned padded string
 */
function padRight(n, char, amount)
{
    const str = n.toString();
    if(amount > str.length)
    {
        for(let i = 0; i < amount - str.length; i++)
        {
            str += char;
        }
    }

    return str;
}

/**
 * Aligns `n` on the right by adding a maximum of `amount` `char` on its left
 * @param {any} n the string or number to align
 * @param {string} char the char to use to align
 * @param {number} amount the maximum length of the returned padded string
 */
function padLeft(n, char, amount)
{
    const str = n.toString();
    let padding = "";

    if(amount > str.length)
    {
        for(let i = 0; i < amount - str.length; i++)
        {
            padding += char;
        }
    }

    return padding + str;
}

/**
 * Preloads images in ram
 * @param {string[]} images paths to the image files
 */
/*
function preloadImages(...images)
{
    const data = images.map(img =>
    {
        return `url(${img})`;
    }).join(" ");

    console.log(images);

    document.head.append(`<style>body:after{position:absolute; width:0; height:0; overflow:hidden;content:${data}}</style>`);
}
*/

/**
 * Returns true if the given `element` is in the array
 * @param {any} element the element to look for
 * @return {boolean} true if the element is in the array
 */
Array.prototype.includes = function(element)
{
    return this.indexOf(element) !== -1;
};

/**
 * Replaces every space in the string with a escaped space
 * @return {string} an escaped string
 */
String.prototype.htmlSpaces = function()
{
    return this.replace(/ /g, "\u00a0");
};

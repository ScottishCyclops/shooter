"use strict"

const DEGREES = 180 / Math.PI;
const PX = "px";

/**
 * Converts a radian angle to a degree angle
 * @param {number} rad the angle in radians
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
 * @param {number} min minimum value, inclusive
 * @param {number} max maximum value, exclusive
 * @return {number} the pseudo-random number
 */
function randInt(min, max)
{
    return Math.floor(randFloat(min, max));
}

/**
 * Returns a pseudo-random floating point between the given extrems
 * @param {number} min minimum value, inclusive
 * @param {number} max maximum value, exclusive
 * @return {number} the pseudo-random number
 */
function randFloat(min, max)
{
    return Math.random() * (max - min) + min;
}

Array.prototype.includes = function(element)
{
    return this.indexOf(element) !== -1;
}

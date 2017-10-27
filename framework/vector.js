"use strict"

class Vector
{
    /**
     * Vector - 2D vector class
     *
     * @param {number} x value of the x axis
     * @param {number} y value of the y axis
     * @public
     */
    constructor(x, y)
    {
        /**
         * The X axis
         *
         * @public
         */
        this.x = x || 0;

        /**
         * The Y axis
         *
         * @public
         */
        this.y = y || 0;
    }

    //Static

    /**
     * Creates a new instance from an array
     *
     * @param {Array} arr array with the x and y values at index 0 and 1 respectively
     * @return {Vector} new vector
     * @public
     */
    fromArray(arr)
    {
        return new Vector(arr[0] || 0, arr[1] || 0);
    }

    /**
     * Creates a new instance from an object
     *
     * @param {Object} obj object with the values for x and y
     * @return {Vector} new vector
     * @public
     */
    fromObject(obj)
    {
        return new Vector(obj.x || 0, obj.y || 0);
    }

    /**
     * Utility method returning vec if it is a vector
     * or otherwise a new vector from vec as x, and y
     *
     * @param {number} vec a vector or the x component of a vector
     * @param {number} y the y component of a vector or nothing
     */
    fromVecY(vec, y)
    {
        return vec instanceof Vector ? vec : new Vector(vec, y || 0);
    }

    //Manipulation

    /**
     * Adds another vector's X axis to this one or a scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    addX(value)
    {
        return new Vector(this.x + value instanceof Vector ? value.x : value, this.y);
    }

    /**
     * Adds another vector's Y axis to this one or a scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    addY(value)
    {
        return new Vector(this.x, this.y + value instanceof Vector ? value.y : value);
    }

    /**
     * Adds another vector to this one or a scalar or an `x, y`
     *
     * @param {any} vec the other vector or scalar
     * @param {number} y the y componant of the vector if given as `x, y`
     * @return {Vector} new vector
     * @public
     */
    add(value, y)
    {
        if(value instanceof Vector)
        {
            return new Vector(this.x + value.x, this.y + value.y);
        }
        else if(y === undefined)
        {
            return new Vector(this.x + value, this.y + value);
        }
        else
        {
            return new Vector(this.x + value, this.y + y);
        }
    }

    /**
     * Subtracts the X axis of another vector from this one or a scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    subtractX(value)
    {
        return new Vector(this.x - value instanceof Vector ? value.x : value, this.y);
    }

    /**
     * Subtracts the Y axis of another vector from this one
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    subtractY(value)
    {
        return new Vector(this.x, this.y - value instanceof Vector ? value.y : value);
    }

    /**
     * Subtracts another vector from this one or a scalar or an `x, y`
     *
     * @param {any} value the other vector or scalar
     * @param {number} y the y componant of the vector if given as `x, y`
     * @return {Vector} new vector
     * @public
     */
    subtract(value, y)
    {
        if(value instanceof Vector)
        {
            return new Vector(this.x - value.x, this.y - value.y);
        }
        else if(y === undefined)
        {
            return new Vector(this.x - value, this.y - value);
        }
        else
        {
            return new Vector(this.x - value, this.y - y);
        }
    }

    /**
     * Divides the X axis by the x component of given vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    divideX(value)
    {
        return new Vector(this.x / value instanceof Vector ? value.x : value, this.y);
    }

    /**
     * Divides the y axis by the y component of given vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    divideY(value)
    {
        return new Vector(this.x, this.y / value instanceof Vector ? value.y : value);
    }

    /**
     * Divied another vector by this one or a scalar or an `x, y`
     *
     * @param {any} value the other vector or scalar
     * @param {number} y the y componant of the vector if given as `x, y`
     * @return {Vector} new vector
     * @public
     */
    divide(value, y)
    {
        if(value instanceof Vector)
        {
            return new Vector(this.x / value.x, this.y / value.y);
        }
        else if(y === undefined)
        {
            return new Vector(this.x / value, this.y / value);
        }
        else
        {
            return new Vector(this.x / value, this.y / y);
        }
    }

    /**
     * Multiply the X axis by the x component of given vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    multiplyX(value)
    {
        return new Vector(this.x * value instanceof Vector ? value.x : value, this.y);
    }

    /**
     * Multiply the y axis by the y component of given vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    multiplyY(value)
    {
        return new Vector(this.x, this.y * value instanceof Vector ? value.y : value);
    }

    /**
     * Multiplies another vector by this one or a scalar or an `x, y`
     *
     * @param {any} value the other vector or scalar
     * @param {number} y the y componant of the vector if given as `x, y`
     * @return {Vector} new vector
     * @public
     */
    multiply(value, y)
    {
        if(value instanceof Vector)
        {
            return new Vector(this.x * value.x, this.y * value.y);
        }
        else if(y === undefined)
        {
            return new Vector(this.x * value, this.y * value);
        }
        else
        {
            return new Vector(this.x * value, this.y * y);
        }
    }

    /**
     * Inverts the X axis
     *
     * @return {Vector} new vector
     * @public
     */
    invertX()
    {
        return new Vector(this.x * -1, this.y);
    }

    /**
     * Inverts the Y axis
     *
     * @return {Vector} new vector
     * @public
     */
    invertY()
    {
        return new Vector(this.x, this.y * -1);
    }

    /**
     * Inverts both axis
     *
     * @return {Vector} new vector
     * @public
     */
    invert()
    {
        return new Vector(this.x * -1, this.y * -1);
    }

    /**
     * Returns a unit vector
     *
     * @return {Vector} new vector
     * @public
     */
    normalize()
    {
        const length = this.length();

        if(length !== 0)
        {
            return this.divide(length);
        }

        return new Vector(1, 0);
    }

    /**
     * Rounds both axis to an integer value
     *
     * @return {Vector} new vector
     * @public
     */
    round()
    {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    /**
     * Floors both axis to an integer value
     *
     * @return {Vector} new vector
     * @public
     */
    floor()
    {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * Ceils both axis to an integer value
     *
     * @return {Vector} new vector
     * @public
     */
    ceil()
    {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * Rounds both axis to a certain precision
     *
     * @param {number} precision the precision to round to
     * @return {Vector} new vector
     * @public
     */
    toFixed(precision)
    {
        if(precision === undefined)
        {
            return this.clone();
        }

        return new Vector(this.x.toFixed(precision), this.y.toFixed(precision));
    }

    /**
     * Performs a linear interpolation of the X axis towards another vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @param {number} amount the blend amount
     * @return {Vector} new vector
     * @public
     */
    lerpX(value, amount)
    {
        return new Vector((1 - amount) * this.x + amount * value instanceof Vector ? value.x : value, this.y);
    }

    /**
     * Performs a linear interpolation of the Y axis towards another vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @param {number} amount the blend amount
     * @return {Vector} new vector
     * @public
     */
    lerpY(value, amount)
    {
        return new Vector(this.x, (1 - amount) * this.y + amount * value instanceof Vector ? value.y : value);
    }

    /**
     * Performs a linear blend / interpolation towards another vector or scalar
     *
     * @param {any} value the other vector or scalar
     * @param {number} amount the blend amount
     * @return {Vector} new vector
     * @public
     */
    lerp(value, amount)
    {
        return new Vector(
            (1 - amount) * this.x + amount * value instanceof Vector ? value.x : value,
            (1 - amount) * this.y + amount * value instanceof Vector ? value.y : value);
    }

    //Products

    /**
     * Creates a clone of this vector
     *
     * @return {Vector} a clone of the vector
     * @public
     */
    clone()
    {
        return new Vector(this.x, this.y);
    }

    /**
     * Calculates the dot product of this vector and another
     *
     * @param {Vector} vec the second vector
     * @return {number} dot product
     * @public
     */
    dot(vec)
    {
        return this.x * vec.x + this.y * vec.y;
    };

    /**
     * Calculates the cross product of this vector and another
     *
     * @param {Vector} vec the second vector
     * @return {number} cross product
     * @public
     */
    cross(vec)
    {
        return (this.x * vec.y) - (this.y * vec.x);
    }

    /**
     * Returns the direction of the vector
     *
     * @return {number} the horizontal angle
     * @public
     */
    horizontalAngle()
    {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the vertical angle of the vector
     *
     * @return {number} the vertical angle
     * @public
     */
    verticalAngle()
    {
        return Math.atan2(this.x, this.y);
    }

    /**
     * Rotates the vector
     *
     * @param {number} angle the angle of rotation in radians
     * @return {Vector} new vector
     * @public
     */
    rotate(angle)
    {
        const nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        const ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

        return new Vector(nx, ny);
    }

    /**
     * Rotates the vector to a certain angle
     *
     * @param {number} angle the angle of rotation in radians
     * @return {Vector} new vector
     * @public
     */
    rotateTo(angle)
    {
        return this.rotateBy(angle - this.horizontalAngle());
    }

    /**
     * Rotates the vector by a certain angle
     *
     * @param {number} angle the angle of rotation in radians
     * @return {Vector} new vector
     * @public
     */
    rotateBy(angle)
    {
        return this.rotate(angle + this.horizontalAngle());
    }

    /**
     * Calculates the distance of the X axis between this vector and another
     *
     * @param {Vector} vec the second vector
     * @return {number} the distance
     * @public
     */
    distanceX(vec)
    {
        return Math.abs(this.x - vec.x);
    }

    /**
     * Calculates the distance of the Y axis between this vector and another
     *
     * @param {Vector} vec the second vector
     * @return {number} the distance
     * @public
     */
    distanceY(vec)
    {
        return Math.abs(this.y - vec.y);
    }

    /**
     * Calculates the euclidean distance between this vector and another
     *
     * @param {Vector} vec the second vector
     * @return {number} the distance
     * @public
     */
    distance(vec)
    {
        const dx = Math.abs(this.x - vec.x);
        const dy = Math.abs(this.y - vec.y);

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculates the length (magnitude) of the vector
     *
     * @return {number} the length (magnitude)
     * @public
     */
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns a true if vector is 0
     *
     * @return {boolean} true if vector is (0, 0)
     * @public
     */
    isZero()
    {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Returns a true if this vector is the same as another
     *
     * @param {Vector} vec the vector to compare
     * @return {boolean} true if vectors are identical
     * @public
     */
    equals(vec)
    {
        return this.x === vec.x && this.y === vec.y;
    }

    /**
     * # Utility Methods
     */

    /**
     * Returns an string representation of the vector
     *
     * @return {string} a string representation of the vector
     * @public
     */
    toString()
    {
        return this.x + ", " + this.y;
    }

    /**
     * Returns a CSS String with the given suffix
     *
     * @param {string} suffix the suffix for each value
     * @return {string} a CSS string representation of the vector
     * @public
     */
    toCssString(suffix)
    {
        suffix = suffix || "";
        return "(" + this.x + suffix + ", " + this.y + suffix + ")";
    }

    /**
     * Returns an array representation of the vector
     *
     * @return {Array} array containing x at index 0 and y at index 1
     * @public
     */
    toArray()
    {
        return [this.x, this.y];
    }

    /**
     * Returns an object representation of the vector
     *
     * @return {Object} an object with x and y keys
     * @public
     */
    toObject()
    {
        return { x: this.x, y: this.y };
    }
}

class Vector
{
    /**
     * Vector - 2D vector class
     * @param {number} x value of the x axis
     * @param {number} y value of the y axis
     * @public
     */
    constructor(x, y)
    {
        /**
         * @property {number} x the x axis
         * @readonly
         */
        this.x = x || 0;

        /**
         * @property {number} y the y axis
         * @readonly
         */
        this.y = y || 0;
    }

    // Static

    /**
     * Creates a new instance from an array
     * @param {Array} arr array with the x and y values at index 0 and 1 respectively
     * @return {Vector} new vector
     * @public
     * @static
     */
    fromArray(arr)
    {
        return new Vector(arr[0] || 0, arr[1] || 0);
    }

    /**
     * Creates a new instance from an object
     * @param {Object} obj object with the values for x and y
     * @return {Vector} new vector
     * @public
     * @static
     */
    fromObject(obj)
    {
        return new Vector(obj.x || 0, obj.y || 0);
    }

    /**
     * Utility method returning vec if it is a vector
     * or otherwise a new vector from vec as x, and y
     * @param {Vector} vec a vector or the x component of a vector
     * @param {number} y the y component of a vector or nothing
     * @return {Vector} new vector
     * @public
     * @static
     */
    fromVecY(vec, y)
    {
        return vec instanceof Vector ? vec : new Vector(vec, y || 0);
    }

    // Manipulation

    /**
     * Adds a scalar to this vector's x axis
     * @param {number} x the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    addX(x)
    {
        return new Vector(this.x + x, this.y);
    }

    /**
     * Adds a scalar to this vector's y axis
     * @param {number} y the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    addY(y)
    {
        return new Vector(this.x, this.y + y);
    }

    /**
     * Adds another vector to this one or a scalar or an `x, y`
     * @param {Vector} vec the other vector or scalar
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
     * Subtracts a scalar from this vector's x axis
     * @param {number} x the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    subtractX(x)
    {
        return new Vector(this.x - x, this.y);
    }

    /**
     * Subtracts a scalar from this vector's y axis
     * @param {number} y the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    subtractY(y)
    {
        return new Vector(this.x, this.y - y);
    }

    /**
     * Subtracts another vector from this one or a scalar or an `x, y`
     * @param {Vector} value the other vector or scalar
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
     * Divides this vector's x axis by a scalar
     * @param {number} x the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    divideX(x)
    {
        return new Vector(this.x / x, this.y);
    }

    /**
     * Divides this vector's x axis by a scalar
     * @param {number} y the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    divideY(y)
    {
        return new Vector(this.x, this.y / y);
    }

    /**
     * Divied another vector by this one or a scalar or an `x, y`
     * @param {Vector} value the other vector or scalar
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
     * Multiplies this vector's x axis by a scalar
     * @param {number} x the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    multiplyX(x)
    {
        return new Vector(this.x * x, this.y);
    }

    /**
     * Multiplies this vector's y axis by a scalar
     * @param {number} y the other vector or scalar
     * @return {Vector} new vector
     * @public
     */
    multiplyY(y)
    {
        return new Vector(this.x, this.y * y);
    }

    /**
     * Multiplies another vector by this one or a scalar or an `x, y`
     * @param {Vector} value the other vector or scalar
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
     * Inverts the x axis
     * @return {Vector} new vector
     * @public
     */
    invertX()
    {
        return new Vector(-this.x, this.y);
    }

    /**
     * Inverts the y axis
     * @return {Vector} new vector
     * @public
     */
    invertY()
    {
        return new Vector(this.x, -this.y);
    }

    /**
     * Inverts both axis
     * @return {Vector} new vector
     * @public
     */
    invert()
    {
        return new Vector(-this.x, -this.y);
    }

    /**
     * Returns a unit vector
     * @return {Vector} new vector
     * @public
     */
    normalize()
    {
        const length = this.length();

        if(length === 0)
        {
            return new Vector(1, 0);
        }

        return new Vector(this.x / length, this.y / length);
    }

    /**
     * Rounds both axis to an integer value
     * @return {Vector} new vector
     * @public
     */
    round()
    {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    /**
     * Floors both axis to an integer value
     * @return {Vector} new vector
     * @public
     */
    floor()
    {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * Ceils both axis to an integer value
     * @return {Vector} new vector
     * @public
     */
    ceil()
    {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * Rounds both axis to a certain precision
     * @param {number} decimals the number of decimals points to leave
     * @return {Vector} new vector
     * @public
     */
    setPrecision(decimals)
    {
        return new Vector(setPrecision(this.x, decimals), setPrecision(this.y, decimals));
    }

    /**
     * Performs a linear interpolation of the x axis towards another value
     * @param {number} value the other value
     * @param {number} amount the blend amount
     * @return {Vector} new vector
     * @public
     */
    lerpX(value, amount)
    {
        return new Vector(lerp(this.x, value, amount), this.y);
    }

    /**
     * Performs a linear interpolation of the y axis towards another value
     * @param {number} value the other value
     * @param {number} amount the blend amount
     * @return {Vector} new vector
     * @public
     */
    lerpY(value, amount)
    {
        return new Vector(this.x, lerp(this.y,  value, amount));
    }

    /**
     * Performs a linear blend / interpolation towards another vector
     * @param {Vector} vec the other vector
     * @param {number} amount the blend amount
     * @return {Vector} new vector
     * @public
     */
    lerp(vec, amount)
    {
        return new Vector(
            lerp(this.x, vec.x, amount),
            lerp(this.y, vec.y, amount));
    }

    /**
     * Calculates the dot product of this vector and another
     * @param {Vector} vec the second vector
     * @return {number} dot product
     * @public
     */
    dot(vec)
    {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * Calculates the cross product of this vector and another
     * @param {Vector} vec the second vector
     * @return {number} cross product
     * @public
     */
    cross(vec)
    {
        return this.x * vec.y - this.y * vec.x;
    }

    /**
     * Returns the direction / horizontal angle of the vector
     * @return {number} the horizontal angle
     * @public
     */
    horizontalAngle()
    {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the vertical angle of the vector
     * @return {number} the vertical angle
     * @public
     */
    verticalAngle()
    {
        return Math.atan2(this.x, this.y);
    }

    // TODO: sort out rotation stuff
    /**
     * Rotates the vector by the given angle
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
     * @param {number} angle the angle of rotation in radians
     * @return {Vector} new vector
     * @public
     */
    rotateBy(angle)
    {
        return this.rotate(angle + this.horizontalAngle());
    }

    /**
     * Calculates the distance between the x avis and a value
     * @param {number} x the other value
     * @return {number} the distance
     * @public
     */
    distanceX(x)
    {
        return Math.abs(this.x - x);
    }

    /**
     * Calculates the distance between the y avis and a value
     * @param {number} y the other value
     * @return {number} the distance
     * @public
     */
    distanceY(y)
    {
        return Math.abs(this.y - y);
    }

    /**
     * Calculates the euclidean distance between this vector and another
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
     * Calculates the length / magnitude of the vector
     * @return {number} the length / magnitude
     * @public
     */
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Sets the length / magnitude of the vector
     * @param {number} length the new length of the vector
     * @return {Vector} new vector
     * @public
     */
    setLength(length)
    {
        return this.normalize().multiply(length);
    }

    /**
     * If the vector's x component is greater than max, sets it to max
     * @param {number} max the maximum value of the x component
     * @return {Vector} a vector with max as maximum length for x
     * @public
     */
    maxX(max)
    {
        if(this.x > max)
        {
            return new Vector(max, this.y);
        }

        return this;
    }

    /**
     * If the vector's y component is greater than max, sets it to max
     * @param {number} max the maximum value of the y component
     * @return {Vector} a vector with max as maximum length for y
     * @public
     */
    maxY(max)
    {
        if(this.y > max)
        {
            return new Vector(this.x, max);
        }

        return this;
    }

    /**
     * If the vector's x component is lesser than min, sets it to min
     * @param {number} min the minimum value of the x component
     * @return {Vector} a vector with min as minimum length for x
     * @public
     */
    minX(min)
    {
        if(this.x < min)
        {
            return new Vector(min, this.y);
        }

        return this;
    }

    /**
     * If the vector's y component is lesser than min, sets it to min
     * @param {number} min the minimum value of the y component
     * @return {Vector} a vector with min as minimum length for y
     * @public
     */
    minY(min)
    {
        if(this.y < min)
        {
            return new Vector(this.x, min);
        }

        return this;
    }

    /**
     * If the vector's length is greater than max, sets it to max
     * @param {number} max the maximum length of the vector
     * @return {Vector} a vector with max as maximum length
     * @public
     */
    limit(max)
    {
        if(this.length() > max)
        {
            return this.setLength(max);
        }

        return this;
    }

    /**
     * Sets the x component of the vector to the specified value
     * @param {number} x the value of the x component
     * @return {Vector} a new vector with x as x component
     */
    setX(x)
    {
        return new Vector(x, this.y);
    }

    /**
     * Sets the y component of the vector to the specified value
     * @param {number} y the value of the y component
     * @return {Vector} a new vector with y as y component
     */
    setY(y)
    {
        return new Vector(this.x, y);
    }

    /**
     * Returns a true if vector is 0
     * @return {boolean} true if vector is (0, 0)
     * @public
     */
    isZero()
    {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Checks if the vector is unit (normalized)
     * @return {boolean} true if the vector's length is 1
     * @public
     */
    isUnit()
    {
        return this.length() === 1;
    }

    /**
     * Returns a true if this vector is the same as another
     * @param {Vector} vec the vector to compare
     * @return {boolean} true if vectors are identical
     * @public
     */
    equals(vec)
    {
        return this.x === vec.x && this.y === vec.y;
    }

    /**
     * Returns a string representation of the vector
     * @return {string} a string representation of the vector
     * @public
     */
    toString()
    {
        return this.x + ", " + this.y;
    }

    /**
     * Returns a CSS string with the given suffix ex: `(10px, 20px)`
     * @param {string} suffix the suffix for each value
     * @return {string} a CSS string representation of the vector
     * @public
     */
    toCssString(suffix)
    {
        suffix = suffix || "";
        return "(" + this.x + suffix + ", " + this.y + suffix + ")";
    }

    toPaddedString(magnitude, precision)
    {
        magnitude = magnitude || 3;
        precision = precision || 2;

        // +1 to account for the dot `100.00`
        // +1 to account for the minus `-100.00`
        const pad = magnitude + precision + 2;

        return `(${padLeft(this.x.toFixed(precision), " ", pad)}, ${padLeft(this.y.toFixed(precision), " ", pad)})`;
    }

    /**
     * Returns an array representation of the vector
     * @return {number[]} array containing x at index 0 and y at index 1
     * @public
     */
    toArray()
    {
        return [this.x, this.y];
    }

    /**
     * Returns an object representation of the vector
     * @return {any} an object with x and y keys
     * @public
     */
    toObject()
    {
        return { x: this.x, y: this.y };
    }
}

// basic vectors
const ZERO_VECTOR = new Vector(0, 0);
const ONE_VECTOR = new Vector(1, 1);

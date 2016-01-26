var ObjProto      = Object.prototype,
    toString      = ObjProto.toString,
    nativeIsArray = Array.isArray,
    property      = function (key) {
        return function (obj) {
            return obj == null ? undefined : obj[key];
        }
    },
    getLength     = property('length'),
    isString      = (obj)=> typeof obj === 'string',
    isArray       = nativeIsArray || ((obj)=> toString.call(obj) === '[object Array]'),
    isArrayLike   = function (collection) {
        if (isString(collection)) {
            return false;
        }
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0;
    },
    isObject      = function (obj) {
        var type = typeof obj;
        return (type === 'function') || (type === 'object' && !!obj);
    },
    flatten       = function (input, shallow, strict, startIndex) {
        var output = [],
            idx    = 0,
            i      = startIndex || 0,
            length = getLength(input);

        while (i < length) {
            let value = input[i];
            if (isArrayLike(value)) {
                // flatten current level of array or arguments object
                if (!shallow) {
                    value = flatten(value, shallow, strict);
                }

                let j   = 0,
                    len = value.length;

                output.length += len;

                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
            i++;
        }

        return output;
    };


class Utility {
    static flatten(array, shallow) {
        return flatten(array, shallow, false);
    }

    static isArray(obj) {
        return isArray(obj);
    }

    static isArrayLike(obj) {
        return isArrayLike(obj);
    }

    static isString(obj) {
        return isString(obj);
    }

    static isObject(obj) {
        return isObject(obj);
    }
}

export default Utility;

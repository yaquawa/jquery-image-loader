(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageLoader = exports.default = undefined;

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ImageLoader = function () {
    /**
     *
     * @param {number} timeout    The timeout value for loading a image.
     * @param {jQuery} jQuery    The jQuery Object.
     */

    function ImageLoader() {
        var timeout = arguments.length <= 0 || arguments[0] === undefined ? 5000 : arguments[0];
        var jQuery = arguments[1];

        _classCallCheck(this, ImageLoader);

        this.timeout = timeout;
        this.$ = jQuery;
    }

    _createClass(ImageLoader, [{
        key: 'load',
        value: function load(imgs, timeout) {
            var d = this.$.Deferred();

            this.doLoad.apply(this, [d, imgs, timeout]);

            return d.promise();
        }

        /**
         * Private method for loading the images given by client.
         * @param {Promise} d    Internal Promise Object.
         * @param {(string|Element)|(string|Element)[]} imgs    The images to load.
         * @param {number} timeout   Optional parameter for timeout.
         */

    }, {
        key: 'doLoad',
        value: function doLoad(d, imgs, timeout) {
            imgs = _Utility2.default.isArray(imgs) ? _Utility2.default.flatten(imgs) : [imgs];

            var loadedImgs = 0,
                imgsLength = imgs.length,
                $ = this.$,
                notifyWith;
            timeout = timeout || this.timeout;

            notifyWith = function notifyWith(eventObj) {
                loadedImgs++;
                var event = $.extend(eventObj, {
                    percentage: Math.round(loadedImgs / imgsLength * 100),
                    index: loadedImgs - 1
                }),
                    context = event.element ? event.element : window;

                d.notifyWith(context, [event]);
                if (loadedImgs === imgsLength) {
                    d.resolveWith(context, [event]);
                }
            };

            $.each(imgs, function (index, img) {
                var $img = typeof img === 'string' ? $('<img>').attr('src', img) : $(img),
                    eventObj = {};

                if (typeof img === 'string') {
                    // `img` is a url
                    $img = $('<img>').attr('src', img);
                    eventObj['image'] = img;
                } else if (img.nodeName) {
                    if (img.nodeName === 'IMG') {
                        // `img` is a img tag
                        $img = $(img);
                    } else {
                        // assume `img` is a Element which has a background-image
                        var imgUrl = $(img).css('background-image').match(/url\("?(.*?)"?\)/);
                        if (imgUrl !== null) {
                            $img = $('<img>').attr('src', imgUrl[1]);
                        } else {
                            throw new Error('No "background-image" found in the given element.');
                        }
                    }
                    eventObj['element'] = img;
                    eventObj['image'] = $img[0].src;
                } else {
                    throw new Error('You must give either a string or DOM object.');
                }

                if ($img[0]['complete']) {
                    notifyWith(eventObj);
                    return;
                }

                $img.one('load', function () {
                    return notifyWith(eventObj);
                }).one('error', function () {
                    return d.rejectWith(img, [$.extend(eventObj, { index: loadedImgs })]);
                });

                if (timeout) {
                    setTimeout(function () {
                        return notifyWith(eventObj);
                    }, timeout);
                }
            });
        }
    }]);

    return ImageLoader;
}();

/**
 * Add ImageLoader as a jQuery plugin.
 * @param {jQuery} $
 */

function ImageLoaderFactory($) {
    $.fn.loadImage = function (timeout) {
        return new ImageLoader(timeout, $).load(this.get());
    };

    function ImageLoaderAlias(timeout) {
        return new ImageLoader(timeout, $);
    }

    $['ImageLoader'] = ImageLoaderAlias;

    return ImageLoader;
}


ImageLoaderFactory(jQuery);


exports.default = ImageLoaderFactory;
exports.ImageLoader = ImageLoader;

},{"./Utility":2}],2:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ObjProto = Object.prototype,
    toString = ObjProto.toString,
    nativeIsArray = Array.isArray,
    property = function property(key) {
    return function (obj) {
        return obj == null ? undefined : obj[key];
    };
},
    getLength = property('length'),
    _isString = function _isString(obj) {
    return typeof obj === 'string';
},
    _isArray = nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]';
},
    _isArrayLike = function _isArrayLike(collection) {
    if (_isString(collection)) {
        return false;
    }
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0;
},
    _isObject = function _isObject(obj) {
    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    return type === 'function' || type === 'object' && !!obj;
},
    _flatten = function _flatten(input, shallow, strict, startIndex) {
    var output = [],
        idx = 0,
        i = startIndex || 0,
        length = getLength(input);

    while (i < length) {
        var value = input[i];
        if (_isArrayLike(value)) {
            // flatten current level of array or arguments object
            if (!shallow) {
                value = _flatten(value, shallow, strict);
            }

            var j = 0,
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

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, null, [{
        key: 'flatten',
        value: function flatten(array, shallow) {
            return _flatten(array, shallow, false);
        }
    }, {
        key: 'isArray',
        value: function isArray(obj) {
            return _isArray(obj);
        }
    }, {
        key: 'isArrayLike',
        value: function isArrayLike(obj) {
            return _isArrayLike(obj);
        }
    }, {
        key: 'isString',
        value: function isString(obj) {
            return _isString(obj);
        }
    }, {
        key: 'isObject',
        value: function isObject(obj) {
            return _isObject(obj);
        }
    }]);

    return Utility;
}();

exports.default = Utility;

},{}]},{},[1]);

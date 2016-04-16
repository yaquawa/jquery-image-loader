import { default as U } from './Utility';

class ImageLoader {
    /**
     *
     * @param {number} timeout    The timeout value for loading a image.
     * @param {jQuery} jQuery    The jQuery Object.
     */
    constructor(timeout = 5000, jQuery) {
        this.timeout = timeout;
        this.$ = jQuery;
    }


    load(imgs, timeout) {
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
    doLoad(d, imgs, timeout) {
        imgs = U.isArray(imgs) ? U.flatten(imgs) : [imgs];

        var loadedImgs = 0,
            imgsLength = imgs.length,
            $          = this.$,
            notifyWith;
        timeout = timeout || this.timeout;

        notifyWith = (eventObj)=> {
            loadedImgs++;
            var event   = $.extend(eventObj, {
                    percentage: Math.round((loadedImgs / imgsLength) * 100),
                    index: loadedImgs - 1
                }),
                context = event.element ? event.element : window;

            d.notifyWith(context, [event]);
            if (loadedImgs === imgsLength) {
                d.resolveWith(context, [event]);
            }
        };

        $.each(imgs, function (index, img) {
            var $img     = typeof img === 'string' ? $('<img>').attr('src', img) : $(img),
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

            $img
                .one('load', ()=> notifyWith(eventObj))
                .one('error', ()=> d.rejectWith(img, [$.extend(eventObj, {index: loadedImgs})]));

            if (timeout) {
                setTimeout((()=> notifyWith(eventObj)), timeout);
            }
        });
    }
}

/**
 * Add ImageLoader as a jQuery plugin.
 * @param {jQuery} $
 */
function ImageLoaderFactory($) {
    $.fn.loadImage = function (timeout) {
        return (new ImageLoader(timeout, $)).load(this.get());
    };

    function ImageLoaderAlias(timeout) {
        return new ImageLoader(timeout, $);
    }

    $['ImageLoader'] = ImageLoaderAlias;

    return ImageLoader;
}

/*
<<<GLOBAL
ImageLoaderFactory(jQuery);
GLOBAL;
*/

export {ImageLoaderFactory as default, ImageLoader};
This is a simple jQuery plugin for loading images.

# Install

`npm install jquery-image-loader --save`

## Classic

Load the jQuery and this plugin.

```html
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="dist/ImageLoader-global.js"></script>
```

## ECMAScript 6

This plugin is written in ECMAScript 6, so you can just simply import the source file.

```js
import $ from 'jquery'
import ImageLoaderFactory from 'src/ImageLoader.js'

// Setup plugin
ImageLoaderFactory($);
```

# Usage

Assume you have the following markup.

```html
<img class="image" src="images/IMG_2969.jpg">
<div class="image" style="background-image:url('images/IMG_3018.jpg');"></div>
```

You can load `IMG_1.jpg` and `IMG_2.jpg` by :

```js
$('.image').loadImg()
     .progress(function (img) {
        console.log('Loading(' + img.percentage + '%)...', img);
     })
     .done(function (img) {
        console.log('All images loaded!', img);
     });
```

If you want to load image by URL, use the `ImageLoader` instance instead.

```js
var imageLoader = $.ImageLoader(), // Create a new ImageLoader instance
    $images     = $('.image'),
    imgs        = [
        'https://static.pexels.com/photos/6151/animal-cute-fur-white.jpg', // Image url
        $images[0], // <img> element
        $images[1] // Element has a `background-image`
    ];

imageLoader
    .load(imgs) // Start load images
    .progress(function (img) {
        console.log('Loading(' + img.percentage + '%)...', img);
    })
    .done(function (img) {
        console.log('All images loaded!', img);
    });
```
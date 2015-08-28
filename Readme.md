Flexible ascii progress bar.

## Installation

```bash
$ npm install progress
```

## Usage

First we create a `ProgressBar`, giving it a format string
as well as the `total`, telling the progress bar when it will
be considered complete. After that all we need to do is `tick()` appropriately.

```javascript
var ProgressBar = require('progress');

var bar = new ProgressBar(':bar', { total: 10 });
var timer = setInterval(function () {
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 100);
```

### Options

These are keys in the options object you can pass to the progress bar along with
`total` as seen in the example above.

- `total` total number of ticks to complete
- `width` the displayed width of the progress bar defaulting to total
- `stream` the output stream defaulting to stderr
- `complete` completion character defaulting to "="
- `incomplete` incomplete character defaulting to "-"
- `renderThrottle` minimum time between updates in milliseconds defaulting to 16
- `clear` option to clear the bar on completion defaulting to false
- `callback` optional function to call when the progress bar completes

### Tokens

These are tokens you can use in the format of your progress bar.

- `:bar` the progress bar itself
- `:current` current tick number
- `:total` total ticks
- `:elapsed` time elapsed in seconds
- `:percent` completion percentage
- `:eta` estimated completion time in seconds

### Custom Tokens

You can define custom tokens by adding a `{'name': value}` object parameter to your method (`tick()`, `update()`, etc.) calls.

```javascript
var bar = new ProgressBar(':current: :token1 :token2', { total: 3 })
bar.tick({
  'token1': "Hello",
  'token2': "World!\n"
})
bar.tick(2, {
  'token1': "Goodbye",
  'token2': "World!"
})
```
The above example would result in the output below.

```
1: Hello World!
3: Goodbye World!
```

## Examples

### Multiple bars

Use the [multi-progress module](github.com/pitaj/multi-progress), an abstraction over the `progress` API which allows for the use of multiple progress bars.

Example usage of `multi-progress`

```js
// require the library
var Multiprogress = require("multi-progress");

// spawn an instance with the optional stream to write to
// use of `new` is optional
var multi = new Multiprogress(process.stderr);

// create a progress bar
var bar = multi.newBar('  downloading cat.jpg [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 30,
  total: size
});

var bar2 = multi.newBar('  downloading dog.jpg [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 30,
  total: size
});

// `bar` and `bar2` are instances of ProgressBar
// Use the progressbar API with them
```

### Download

In our download example each tick has a variable influence, so we pass the chunk
length which adjusts the progress bar appropriately relative to the total
length.

```javascript
var ProgressBar = require('../');
var https = require('https');

var req = https.request({
  host: 'download.github.com',
  port: 443,
  path: '/visionmedia-node-jscoverage-0d4608a.zip'
});

req.on('response', function(res){
  var len = parseInt(res.headers['content-length'], 10);

  console.log();
  var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: len
  });

  res.on('data', function (chunk) {
    bar.tick(chunk.length);
  });

  res.on('end', function () {
    console.log('\n');
  });
});

req.end();
```

The above example result in a progress bar like the one below.

```
downloading [=====             ] 29% 3.7s
```

You can see more examples in the `examples` folder.

## License

MIT

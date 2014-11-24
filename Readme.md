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

If you decide to use a infinite progress bar, you need to just use the `start` and `finish` methods as shown below.

### Options

These are keys in the options object you can pass to the progress bar along with
`total` as seen in the example above.

- `total` total number of ticks to complete
- `width` the displayed width of the progress bar defaulting to total
- `stream` the output stream defaulting to stderr
- `complete` completion character defaulting to "="
- `incomplete` incomplete character defaulting to "-"
- `clear` option to clear the bar on completion defaulting to false
- `callback` optional function to call when the progress bar completes

It is also possible to create a infinite progress bar. To do so, you need to pass a `infinite` boolean on options.

For infinite progress bar, the `start` method can receive the following parameters.

- `message` the message to be displayed (if you use `:message` format)
- `tick` the refresh rate of the progress bar
- `longWaitMessage` a message to be shown after a long wait
- `longWaitTick` the amount of time that you need to wait until the message is displayed

### Tokens

These are tokens you can use in the format of your progress bar.

- `:bar` the progress bar itself
- `:current` current tick number
- `:total` total ticks
- `:elapsed` time elapsed in seconds
- `:percent` completion percentage
- `:eta` estimated completion time in seconds

These are tokens you can use in the format of your infinite progress bar.

- `:rotary` simulates a rotary motion with `| / - \ |`
- `:message` a custom message to display (default: 'Loading')
- `:ellipsis` an ellipsis animation `. .. ... ....`

## Examples

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

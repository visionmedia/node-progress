/**
 * A simple progressbar with synchronous calls to tick()
 * (i.e. no setTimeout/setInterval)
 */

var ProgressBar = require('../');

var len = 10000000; // Adjust to your machine's speed
var bar = new ProgressBar('[:bar]', {total: len, renderThrottle: 100});

for (var i = 0; i <= len; i++) {
  bar.tick();
}
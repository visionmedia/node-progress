
/**
 * Module dependencies.
 */

var ProgressBar = require('../');

// simulated download, passing the chunk lengths to tick()

var contentLength = 128 * 1024;

var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
    complete: '='
  , incomplete: ' '
  , width: 20
  , total: contentLength
});

(function next() {
  if (contentLength) {
    var chunk = Math.random() * 10 * 1024;
    bar.tick(chunk);
    if (bar.complete) {
      console.log();
    } else {
      setTimeout(next, Math.random() * 1000);
    }
  }
})();
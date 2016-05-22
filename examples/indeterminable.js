/**
 * An example to show how node-progress handles user-specified widths
 * which exceed the number of columns in the terminal
 */

var ProgressBar = require('../');

// simulated download, passing the chunk lengths to tick()

var bar = new ProgressBar(' [:wheel][:bar] :current/:total :elapseds :percent :etas', {
    complete: '='
  , incomplete: ' '
  , width: 50
  , total: -1 // total number of ticks is unknown
});

(function next() {
  bar.tick(1);
  if (bar.curr >= 150) {
    bar.done();
  } else {
    setTimeout(next, 50);
  }
})();

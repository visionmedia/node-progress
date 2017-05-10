/**
 * An example to show how node-progress handles progress bar
 * with unknown total number of ticks
 */

var ProgressBar = require('../');

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

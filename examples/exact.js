
/**
 * Module dependencies.
 *
 * Example to show off the `update` method, which allows the
 * user to specify an exact progress.
 */

var ProgressBar = require('../');

var bar = new ProgressBar('  progress [:bar] :percent :etas', {
    complete: '='
  , incomplete: ' '
  , width: 40
  , total: 100
});

var i = 0, steps = [0.1, 0.25, 0.6, 0.8, 0.4, 0.5, 0.6, 0.2, 0.8, 1.0];

(function next() {
  if (i >= steps.length) {
  } else {
    bar.update(steps[i++]);
    setTimeout(next, 500);
  }
})();

var ProgressBar = require('../');

// Demonstrates reusing the progress bar

var list = ['file1.ext', 'file2.ext', 'file3.ext'];

var bar = new ProgressBar('  loading :filename :percent[:bar] :current/:total', {
  total: 0, // This value is required, but unused as we'll
            // be setting it later with bar.start()
  width: 10
});

// Loop through list items
(function next() {
  if (list.length === 0) return;
  var file = list.shift();
  bar.start(parseInt((Math.random() * 100000) + 100000), {'filename': file});

  // loop through chunks
  (function nextChunk() {
    var chunk = Math.min(bar.total - bar.curr, parseInt((Math.random() * 20) + 1) * 1024);
    bar.tick(chunk, {'filename': file});
    if (!bar.complete) {
      setTimeout(nextChunk, parseInt((Math.random() * 100) + 1) * 4);
    } else {
      next();
    }
  })();
})();

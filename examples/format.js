var Progress = require('../')

var contentLength = 15000 * 1024;

var bar = new Progress('  downloading [:bar] :current/:total', {
  total: contentLength,
  format: function (bytes) {
    var value = Math.round(bytes / (1 << 20) * 100) / 100;
    return value + 'MB';
  }
});

var id = setInterval(function() {
  var chunk = Math.random() * 1000 * 1024;
  bar.tick(chunk);
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

var ProgressBar = require('..');

var bar = new ProgressBar('  [:bar]', {
  complete: '=',
  incomplete: '-',
  total: 20,
  callback: function () {
    bar.config({ complete: '▓' });
  }
});

var id = setInterval(function (){
  bar.tick();
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

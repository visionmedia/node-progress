var green = '\u001b[42m \u001b[0m';
var red = '\u001b[41m \u001b[0m';

var ProgressBar = require('../');

var bar = new ProgressBar(' :title [:bar] :percent', {
  complete: green,
  incomplete: red,
  total: 20
});

var id = setInterval(function (){
  bar.tick({title: 'Download:'});
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

var ProgressBar = require('../');

// Demonstrates the use of `cursor` option

var bar = new ProgressBar('  [:bar] :percent',{
    total: 50,
    width: 10,
    complete: '=',
    cursor: '>',
    incomplete: ' ',
    callback: function() {
      clearInterval(interval);
    }
});

var interval = setInterval(function (){
  bar.tick();
}, 50);

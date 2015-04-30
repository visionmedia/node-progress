var ProgressBar = require('../');

// Demonstrates starting the bar before first tick

var bar = new ProgressBar('  [:bar] :elapsed', {
  total: 10,
  callback: function() {
    clearInterval(interval);
  }
});

bar.start();
var interval = setInterval(function (){
  bar.tick();
}, 500);

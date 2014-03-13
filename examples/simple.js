var ProgressBar = require('../')
  , bar         = new ProgressBar('  [:bar]', 10);

var id = setInterval(function (){
  bar.tick();
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

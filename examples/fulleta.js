var ProgressBar = require('../')
  , bar         = new ProgressBar('  [:bar] :hours::minutes::seconds', 2000);

var id = setInterval(function (){
  bar.tick();
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

var ProgressBar = require('../');

var green = '\u001b[42m \u001b[0m';
var red = '\u001b[41m \u001b[0m';

bar = new ProgressBar(':current/:total :bar :percent :elapseds', {
    total: 100,
    complete: green,
    incomplete: red,
});

var id = setInterval(function (){
    bar.tick();
    if (bar.complete) {
      clearInterval(id);
    }
}, 100);
  

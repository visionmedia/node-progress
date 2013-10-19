var ProgressBar = require('../')
  , bar         = new ProgressBar('[:bar]', {total:10, busywaiting:true});

// as long as the program waits for a response
// show a progress bar that moves periodically indicating
// that there is something going on
setTimeout(function(){
    var id = setInterval(function (){
      bar.tick();
      if (bar.complete) {
        clearInterval(id);
      }
    }, 100);
}, 3000);




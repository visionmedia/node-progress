var ProgressBar = require('../')
  , bar         = new ProgressBar('[:bar]  :percent :etas', {total:10, busywaiting:true})
  , timer;

// as long as the program waits for a response
// show a progress bar that moves periodically indicating
// that there is something going on
setTimeout(function(){
    timer = setInterval(progress, 100);
}, 3000);

function progress(){
  bar.tick();
  if(bar.curr == 4){
    clearInterval(timer);
    bar.makeBusy();
    setTimeout(function(){
      bar.tick();
      timer = setInterval(progress, 200);
    },1500);
  }
  if (bar.complete) {
    clearInterval(timer);
  }
}



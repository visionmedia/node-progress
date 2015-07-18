function seconds(ms){
  return Math.floor(ms/1000) + " seconds"
}

var Progress = require('../')

var bar  = new Progress(':bar :percent :elapsed', {
  total: 100,
  width: 25,
  formatter: function(eta, elapsed, percent){
    return this.fmt
      .replace(':current', this.curr)
      .replace(':total', this.total)
      .replace(':elapsed', isNaN(elapsed) ? '0.0' : seconds(elapsed))
      .replace(':eta', (isNaN(eta) || !isFinite(eta)) ? '0.0' : (eta / 1000)
        .toFixed(1))
      .replace(':percent', percent.toFixed(0) + '%')
  }
});

var id = setInterval(function (){
  bar.tick();
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

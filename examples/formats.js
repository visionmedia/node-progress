
/**
 * Module dependencies.
 */

var ProgressBar = require('../');

var bar = new ProgressBar(':bar', { total: 10 });

console.log('processing:');
var id = setInterval(function(){
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(id);
    bar2();
  }
}, 100);

function bar2() {
  var bar = new ProgressBar('  processing: [:bar]', {
      total: 15
    , complete: '*'
    , incomplete: ' '
  });

  var id = setInterval(function(){
    bar.tick();
    if (bar.complete) {
      console.log('\n');
      clearInterval(id);
      bar3();
    }
  }, 100);
}

function bar3() {
  var bar = new ProgressBar('  download |:bar| :percent', {
      complete: '='
    , incomplete: ' '
    , width: 40
    , total: 20
  });

  var id = setInterval(function(){
    bar.tick();
    if (bar.complete) {
      console.log('\n');
      clearInterval(id);
      bar4();
    }
  }, 100);
}

function bar4() {
  var bar = new ProgressBar('  :current of :total :percent', {
    total: 20
  });

  var id = setInterval(function(){
    bar.tick();
    if (bar.complete) {
      console.log('\n');
      clearInterval(id);
      bar5();
    }
  }, 100);
}

function bar5() {
  var bar = new ProgressBar('  [:bar] :elapseds elapsed, eta :etas', {
      width: 8
    , total: 50
  });

  var id = setInterval(function(){
    bar.tick();
    if (bar.complete) {
      console.log('\n');
      clearInterval(id);
    }
  }, 300);
}

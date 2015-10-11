/**
 * Module dependencies.
 */

var ProgressBar = require('../');

message1();

function message1() {
  var contentLength = 28 * 1024;
  var bar = new ProgressBar(' Downloading [:bar] :percent :etas', {
    complete: '=',
    clear: true,  // This is important to avoid any additional newline.
    incomplete: ' ',
    width: 40,
    total: contentLength
  });
  
  var id = setInterval(function(){
    if (contentLength) {
      var chunk = Math.random() * 10 * 1024;
      bar.tick(chunk);

      if (bar.complete) {
        bar.message('= Saved as file: C:\example.txt', true);
        clearInterval(id);
        message2();
      }
    }
  }, 1000);
}

function message2() {
  var bar = new ProgressBar(' Downloading [:bar] :percent :elapseds elapsed', {
    complete: '=',
    incomplete: ' ',
    clear: true,  // This is important to avoid any additional newline.
    width: 40,
    total: 20
  });
  
  var counter = 0;
  var id = setInterval(function(){
    bar.tick();
    if (bar.complete || counter >= 5) {
      bar.message('= Error download file from http://example.org/example.org',
          true);
      clearInterval(id);
      message3();
    }
    counter++;
  }, 100);
}


function message3() {
  var green = '\u001b[42m \u001b[0m';
  var red = '\u001b[41m \u001b[0m';
  var bar = new ProgressBar(' Downloading [:bar] :percent :elapseds elapsed', {
    complete: green,
    incomplete: red,
    clear: true, // This is important to avoid any additional newline.
    total: 20
  });
  
  var counter = 0;
  var id = setInterval(function(){
    bar.tick();
    if (bar.complete || counter >= 6) {
      bar.message('= Network error !', true);
      clearInterval(id);
    }
    counter++;
  }, 100);
}
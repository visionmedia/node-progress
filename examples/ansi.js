var colors = [
  '\u001b[42m \u001b[0m',
  '\u001b[41m \u001b[0m'
];

var ProgressBar = require('../');

var format = '';
for (var i = 0; i < 40; ++i) {
  format += colors[i % 2];
}

console.log('ANSI colors supported in the format parameter.');
console.log('36 steps should be visible for the :bar width on a screen of 80 chars.');

var bar = new ProgressBar(format + ' [:bar]', {
  total: 36
});

var id = setInterval(function (){
  bar.tick();
  if (bar.complete) {
    clearInterval(id);
  }
}, 100);

'use strict';
const ProgressBar = require('../');

const bar = new ProgressBar("Multiple tokens contain current::current  current::current  total::total elapsed::elapseds  etas::etas  rate::rate  percent::percent  [:bar] current::current  total::total elapsed::elapseds  etas::etas  rate::rate  percent::percent, hello world!",
    { total: 100 });
let timerBar = setInterval( () => {
  bar.tick();
  if (bar.complete) {
    clearInterval(timerBar);
  }
}, 10);

const baz = new ProgressBar('The two bar [:bar] and [:bar], hello world!', {total: 100});
let timerBaz = setInterval( () => {
  baz.tick();
  if (baz.complete) {
    clearInterval(timerBaz);
  }
}, 10);
/**
 * An example to show a progress bar using setCurrent methdod.
 */

var ProgressBar = require('../');

var bar = new ProgressBar(':bar :current/:total', {total: 10});
var timer = setInterval(function () {
    bar.setCurrent(Math.ceil(Math.random() * bar.total), false);
}, 200);

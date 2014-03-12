/*!
 * node-progress
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Expose `ProgressBar`.
 */

exports = module.exports = ProgressBar;

/**
 * Initialize a `ProgressBar` with the given
 * `fmt` string and `options` or `total`.
 *
 * Options:
 *
 *   - `total` total number of ticks to complete
 *   - `width` the displayed width of the progress bar defaulting to total
 *   - `stream` the output stream defaulting to stderr
 *   - `complete` completion character defaulting to "="
 *   - `incomplete` incomplete character defaulting to "-"
 *   - `callback` optional function to call when the progress bar completes
 *
 * Tokens:
 *
 *   - `:bar` the progress bar itself
 *   - `:current` current tick number
 *   - `:total` total ticks
 *   - `:elapsed` time elapsed in seconds
 *   - `:percent` completion percentage
 *   - `:eta` eta in seconds
 *
 * @param {String} fmt
 * @param {Object|Number} options or total
 * @api public
 */

function ProgressBar(fmt, options) {
  this.stream = options.stream || process.stderr;
  this.rl = require('readline').createInterface({
    input: process.stdin,
    output: this.stream
  });
  this.rl.setPrompt('', 0);
  this.rl.clearLine = function() {
    this.write(null, {ctrl: true, name: 'u'});
  };

  if (typeof(options) == 'number') {
    var total = options;
    options = {};
    options.total = total;
  } else {
    options = options || {};
    if ('string' != typeof fmt) throw new Error('format required');
    if ('number' != typeof options.total) throw new Error('total required');
  }

  this.fmt = fmt;
  this.curr = 0;
  this.total = options.total;
  this.width = options.width || this.total;
  this.clear = options.clear
  this.chars = {
      complete: options.complete || '='
    , incomplete: options.incomplete || '-'
  };
  this.callback = options.callback || function () {};
  this.lastDraw = '';
}

/**
 * "tick" the progress bar with optional `len` and
 * optional `tokens`.
 *
 * @param {Number|Object} len or tokens
 * @param {Object} tokens
 * @api public
 */

ProgressBar.prototype.tick = function(len, tokens){
  if (len !== 0)
    len = len || 1;

  // swap tokens
  if ('object' == typeof len) tokens = len, len = 1;

  // start time for eta
  if (0 == this.curr) this.start = new Date;

  this.curr += len
  this.render(tokens);

  // progress complete
  if (this.curr >= this.total) {
    this.complete = true;
    this.terminate();
    this.callback(this);
    return;
  }
};

/**
 * Method to render the progress bar with optional `tokens` to
 * place in the progress bar's `fmt` field.
 *
 * @param {Object} tokens
 * @api public
 */

ProgressBar.prototype.render = function(tokens){
  if (!this.stream.isTTY) {
    return;
  }

  var ratio = this.curr / this.total;
  ratio = Math.min(Math.max(ratio, 0), 1);

  var percent = ratio * 100
    , complete = Math.round(this.width * ratio)
    , incomplete
    , elapsed = new Date - this.start
    , eta = (percent == 100) ? 0 : elapsed * (this.total / this.curr - 1);

  complete = Array(complete).join(this.chars.complete);
  incomplete = Array(this.width - complete.length).join(this.chars.incomplete);

  var str = this.fmt
    .replace(':bar', complete + incomplete)
    .replace(':current', this.curr)
    .replace(':total', this.total)
    .replace(':elapsed', isNaN(elapsed) ? "0.0" : (elapsed / 1000).toFixed(1))
    .replace(':eta', (isNaN(eta) || !isFinite(eta)) ? "0.0" : (eta / 1000).toFixed(1))
    .replace(':percent', percent.toFixed(0) + '%');

  if (tokens) {
    for (var key in tokens) {
      str = str.replace(':' + key, tokens[key]);
    }
  }

  if (this.lastDraw !== str) {
    this.rl.clearLine();
    this.rl.write(str);
    this.lastDraw = str;
  }
};

/**
 * "update" the progress bar to represent an exact percentage.
 * The ratio (between 0 and 1) specified will be multiplied by `total` and
 * floored, representing the closest available "tick." For example, if a
 * progress bar has a length of 3 and `update(0.5)` is called, the progress
 * will be set to 1.
 *
 * A ratio of 0.5 will attempt to set the progress to halfway.
 *
 * @param {Number} ratio The ratio (between 0 and 1 inclusive) to set the
 *     overall completion to.
 * @api public
 */

ProgressBar.prototype.update = function(ratio, tokens) {
  var goal = Math.floor(ratio * this.total);
  var delta = goal - this.curr;

  this.tick(delta, tokens);
};

/**
 * Terminates a progress bar.
 *
 * @api public
 */

ProgressBar.prototype.terminate = function() {
  this.rl.resume();

  if (this.clear) {
    this.rl.clearLine();
    this.rl.close();
  } else {
    this.rl.close();
    console.log();
  }
};

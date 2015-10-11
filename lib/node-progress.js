/*!
 * node-progress
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Initialize a `ProgressBar` with the given `fmt` string and `options` or
 * `total`.
 *
 * Options:
 *
 *   - `total` total number of ticks to complete
 *   - `width` the displayed width of the progress bar defaulting to total
 *   - `stream` the output stream defaulting to stderr
 *   - `complete` completion character defaulting to "="
 *   - `incomplete` incomplete character defaulting to "-"
 *   - `renderThrottle` minimum time between updates in milliseconds defaulting to 16
 *   - `callback` optional function to call when the progress bar completes
 *   - `clear` will clear the progress bar upon termination
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
 * @param {string} fmt
 * @param {object|number} options or total
 * @api public
 */
var ProgressBar = function(fmt, options) {
  this.stream = options.stream || process.stderr;

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
  this.clear = options.clear;
  this.chars = {
    complete   : options.complete || '=',
    incomplete : options.incomplete || '-'
  };
  this.renderThrottle = options.renderThrottle !== 0 ?
      (options.renderThrottle || 16) : 0;
  this.callback = options.callback || function () {};
  this.tokens = {};
  this.lastDraw = '';
};


/**
 * "tick" the progress bar with optional `len` and optional `tokens`.
 *
 * @param {number|object} len or tokens
 * @param {object=} opt_tokens
 * @api public
 */
ProgressBar.prototype.tick = function(len, opt_tokens) {
  if (len !== 0)
    len = len || 1;

  // swap tokens
  if ('object' == typeof len) opt_tokens = len, len = 1;
  if (opt_tokens) this.tokens = opt_tokens;

  // start time for eta
  if (0 == this.curr) this.start = new Date;

  this.curr += len

  // schedule render
  if (!this.renderThrottleTimeout) {
    this.renderThrottleTimeout = setTimeout(this.render.bind(this),
        this.renderThrottle);
  }

  // progress complete
  if (this.curr >= this.total) {
    if (this.renderThrottleTimeout) this.render();
    this.complete = true;
    this.terminate();
    this.callback(this);
    return;
  }
};


/**
 * Method to render the progress bar with optional `tokens` to place in the
 * progress bar's `fmt` field.
 *
 * @param {object=} opt_tokens
 * @param {string=} opt_message
 * @api public
 */
ProgressBar.prototype.render = function(opt_tokens, opt_message) {
  clearTimeout(this.renderThrottleTimeout);
  this.renderThrottleTimeout = null;

  if (opt_tokens) this.tokens = opt_tokens;

  if (!this.stream.isTTY) return;

  var ratio = this.curr / this.total;
  ratio = Math.min(Math.max(ratio, 0), 1);

  var percent = ratio * 100;
  var incomplete, complete, completeLength;
  var elapsed = new Date - this.start;
  var eta = (percent == 100) ? 0 : elapsed * (this.total / this.curr - 1);

  /* populate the bar template with percentages and timestamps */
  var str = this.fmt
    .replace(':current', this.curr)
    .replace(':total', this.total)
    .replace(':elapsed', isNaN(elapsed) ? '0.0' : (elapsed / 1000).toFixed(1))
    .replace(':eta', (isNaN(eta) || !isFinite(eta)) ? '0.0' : (eta / 1000)
      .toFixed(1))
    .replace(':percent', percent.toFixed(0) + '%');

  /* compute the available space (non-zero) for the bar */
  var availableSpace = Math.max(0,
      this.stream.columns - str.replace(':bar', '').length);
  var width = Math.min(this.width, availableSpace);

  /* TODO: the following assumes the user has one ':bar' token */
  completeLength = Math.round(width * ratio);
  complete = Array(completeLength + 1).join(this.chars.complete);
  incomplete = Array(width - completeLength + 1).join(this.chars.incomplete);

  /* fill in the actual progress bar */
  if (opt_message) {
    /* TODO: Supporting color codes.*/
    var message = opt_message;
    var messageLength = message.length;
    if (messageLength > width) {
      message = message.substr(0, width - 3) + '...';
    } else {
      message = message + Array(width - messageLength + 1).join(
          this.chars.incomplete);
    }
    str = str.replace(':bar', message);
  } else {
    str = str.replace(':bar', complete + incomplete);
  }

  /* replace the extra tokens */
  if (this.tokens) {
    for (var key in this.tokens) {
      str = str.replace(':' + key, this.tokens[key]);
    }
  }

  if (this.lastDraw !== str) {
    this.stream.cursorTo(0);
    this.stream.write(str);
    this.stream.clearLine(1);
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
 * @param {number} ratio The ratio (between 0 and 1 inclusive) to set the
 *   overall completion to.
 * @param {object=} opt_tokens
 * @api public
 */
ProgressBar.prototype.update = function(ratio, opt_tokens) {
  var goal = Math.floor(ratio * this.total);
  var delta = goal - this.curr;
  this.tick(delta, opt_tokens);
};


/**
 * Updates the progress bar with the provided messages.
 * If the message is to long it will be shortend by the width of the
 * progress bar.
 * @param {string} message Custom message to display
 * @param {boolean=} opt_finished If true, terminate the progressbar.
 * @param {object=} opt_tokens
 * @api public
 */
ProgressBar.prototype.message = function(message, opt_finished, opt_tokens) {
  this.render(opt_tokens, message);
  if (opt_finished) {
    this.terminate(false);
  }
};


/**
 * Terminates a progress bar.
 * @param {boolean=} opt_clear
 * @api public
 */
ProgressBar.prototype.terminate = function(opt_clear) {
  if (typeof opt_clear === 'undefined' && this.clear || opt_clear) {
    this.stream.clearLine();
    this.stream.cursorTo(0);
  } else {
    this.stream.write('\n');
  }
};


/**
 * Expose `ProgressBar`.
 */
exports = module.exports = ProgressBar;

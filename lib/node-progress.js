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

function ProgressBar(fmt, options) {
  this.stream = options.stream || process.stderr;
  this.infinite = false;
  this.infiniteOptions;

  if (typeof(options) == 'number') {
    var total = options;
    options = {};
    options.total = total;
  } else {
    options = options || {};
    if ('string' != typeof fmt) throw new Error('format required');
    if ('number' != typeof options.total
     && !options.infinite) throw new Error('total required');

    this.infinite = options.infinite || false;
  }

  this.fmt = fmt;
  this.curr = 0;
  this.total = options.total;
  this.width = options.width || this.total;
  this.clear = options.clear
  this.chars = {
    complete   : options.complete || '=',
    incomplete : options.incomplete || '-'
  };
  this.callback = options.callback || function () {};
  this.lastDraw = '';
}

/**
 * "starts" the progress bar when infinite flag is set.
 *
 * @param {string|number|object}
 *    | string: message
 *    | number: tick
 *    | object:
 *    |-- message
 *    |-- tick
 *    |-- longWaitTick
 *    |-- longWaitMessage
 * @api public
 */

ProgressBar.prototype.start = function(options) {

  if(!this.infinite) throw new Error('use "tick" when using finite');

  this.infiniteOptions = {
    message : 'Loading',
    tick : 150,
    longWaitTick : 300
  };

  if (typeof(options) == 'string') {
    this.infiniteOptions.message = options;
  } else if (typeof(options) == 'number') {
    this.infiniteOptions.tick = options;
  } else {
    options = options || {};
    if ('string' == typeof options.message)
      this.infiniteOptions.message = options.message;

    if ('number' == typeof options.tick)
      this.infiniteOptions.tick = options.tick;

    if ('number' == typeof options.longWaitTick)
      this.infiniteOptions.longWaitTick = options.longWaitTick;

    if ('string' == typeof options.longWaitMessage)
      this.infiniteOptions.longWaitMessage = options.longWaitMessage;
  }

  this.infiniteOptions.timeSpent = 1;

  /* TODO: allow changes on the following tokens */
  this.infiniteOptions.rotaries = [ '-', '\\', '|', '/' ];
  this.infiniteOptions.ellipsis = [ '.', '..', '...', '....'];

  var self = this;

  /* TODO: trigger event when longWaitMessage is displayed */
  this.infiniteOptions.interval = setInterval(function() {
    if (self.infiniteOptions.longWaitMessage
     && (self.infiniteOptions.timeSpent * self.infiniteOptions.tick) / self.infiniteOptions.longWaitTick > 1) {
      self.infiniteOptions.timeSpent = 1;
      self.stream.clearLine();
      self.stream.write(self.infiniteOptions.longWaitMessage + '\n');
    }

    self.stream.clearLine();
    self.stream.write(self.fmt
      .replace(':rotary', self.infiniteOptions.rotaries[self.curr])
      .replace(':message', self.infiniteOptions.message)
      .replace(':ellipsis', self.infiniteOptions.ellipsis[self.curr]));

    self.curr++;
    self.stream.cursorTo(0);

    if(self.curr > 3) {
      self.curr = 0;
    }

    self.infiniteOptions.timeSpent += 1;
  }, this.infiniteOptions.tick);
}

/**
 * "finishes" the progress bar when infinite flag is set.
 *
 * @api public
 */

ProgressBar.prototype.finish = function(options) {
  this.stream.clearLine();
  this.infiniteOptions.timeSpent = 0;
  this.curr = 0;
  clearInterval(this.infiniteOptions.interval);
}

/**
 * "tick" the progress bar with optional `len` and optional `tokens`.
 *
 * @param {number|object} len or tokens
 * @param {object} tokens
 * @api public
 */

ProgressBar.prototype.tick = function(len, tokens) {

  if(this.infinite) throw new Error('use "start" and "finish" when using infinite');

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
 * Method to render the progress bar with optional `tokens` to place in the
 * progress bar's `fmt` field.
 *
 * @param {object} tokens
 * @api public
 */

ProgressBar.prototype.render = function (tokens) {
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
  var availableSpace = Math.max(0, this.stream.columns - str.replace(':bar', '').length);
  var width = Math.min(this.width, availableSpace);

  /* TODO: the following assumes the user has one ':bar' token */
  completeLength = Math.round(width * ratio);
  complete = Array(completeLength + 1).join(this.chars.complete);
  incomplete = Array(width - completeLength + 1).join(this.chars.incomplete);

  /* fill in the actual progress bar */
  str = str.replace(':bar', complete + incomplete);

  /* replace the extra tokens */
  if (tokens) for (var key in tokens) str = str.replace(':' + key, tokens[key]);

  if (this.lastDraw !== str) {
    this.stream.clearLine();
    this.stream.cursorTo(0);
    this.stream.write(str);
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
 * @api public
 */

ProgressBar.prototype.update = function (ratio, tokens) {
  var goal = Math.floor(ratio * this.total);
  var delta = goal - this.curr;

  this.tick(delta, tokens);
};

/**
 * Terminates a progress bar.
 *
 * @api public
 */

ProgressBar.prototype.terminate = function () {
  if (this.clear) {
    this.stream.clearLine();
    this.stream.cursorTo(0);
  } else console.log();
};

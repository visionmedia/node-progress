var assert = require('assert');
var ProgressBar = require('../');
var tests = 0;
var failures = 0;

function test(name, fn) {
  tests++;
  try {
    fn();
    console.log('ok - ' + name);
  } catch (err) {
    failures++;
    console.log('not ok - ' + name);
    console.error(err.stack || err);
  }
}

function capture(terminal) {
  var stream = {
    events: [],
    write: function (message) {
      this.events.push(['write', message]);
    }
  };
  if (terminal) {
    stream.isTTY = true;
    stream.columns = 80;
    stream.clearLine = function (direction) {
      this.events.push(['clearLine', direction]);
    };
    stream.cursorTo = function (column) {
      this.events.push(['cursorTo', column]);
    };
  }
  return stream;
}

function bar(stream) {
  return new ProgressBar(':bar', {
    total: 4,
    width: 4,
    renderThrottle: 0,
    stream: stream
  });
}

test('writes messages to a stream without terminal methods', function () {
  var stream = capture(false);
  bar(stream).interrupt('notice');
  assert.deepEqual(stream.events, [['write', 'notice'], ['write', '\n']]);
});

test('does not use terminal methods on an explicitly non-TTY stream', function () {
  var stream = capture(true);
  stream.isTTY = false;
  bar(stream).interrupt('notice');
  assert.deepEqual(stream.events, [['write', 'notice'], ['write', '\n']]);
});

test('clears and restores a TTY progress bar in order', function () {
  var stream = capture(true);
  var progress = bar(stream);
  progress.tick(2);
  stream.events.length = 0;
  progress.interrupt('notice');
  assert.deepEqual(stream.events, [
    ['clearLine', undefined],
    ['cursorTo', 0],
    ['write', 'notice'],
    ['write', '\n'],
    ['write', '==--']
  ]);
});

test('preserves multiline messages on non-TTY streams', function () {
  var stream = capture(false);
  bar(stream).interrupt('first\nsecond');
  assert.deepEqual(stream.events, [['write', 'first\nsecond'], ['write', '\n']]);
});

test('preserves empty messages on non-TTY streams', function () {
  var stream = capture(false);
  bar(stream).interrupt('');
  assert.deepEqual(stream.events, [['write', ''], ['write', '\n']]);
});

test('does not redraw an old bar after its stream becomes non-TTY', function () {
  var stream = capture(true);
  var progress = bar(stream);
  progress.tick(2);
  stream.events.length = 0;
  stream.isTTY = false;
  progress.interrupt('notice');
  assert.deepEqual(stream.events, [['write', 'notice'], ['write', '\n']]);
});

console.log(JSON.stringify({ tests: tests, passes: tests - failures, failures: failures }));
process.exit(failures ? 1 : 0);

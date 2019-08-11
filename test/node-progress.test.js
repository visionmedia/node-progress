const ProgressBar = require('../index');
const intercept = require("intercept-stdout");

const CLEAR_LINE = '\u001b[1G';
const CURSOR_TO_START = '\u001b[0K';
const NEW_LINE = '\n';



const simulateProgressBar = (bar, callback, tickDuration = 50, ticks = bar.total) => {
  for (let i = 0; i < ticks; i++) {
    setTimeout(() => bar.tick(), tickDuration * i);
  }
  setTimeout(callback, (ticks + 1) * tickDuration);
}

describe('ProgressBar', () => {

  let stdout = [];
  let stderr = [];
  let unhook;

  beforeAll(() => {
    unhook = intercept(
      (out) => { stdout.push(out); return ''; },
      (err) => { stderr.push(err); return ''; }
    );
  })

  beforeEach(() => {
    stdout = [];
    stderr = [];
  });

  afterAll(() => {
    unhook();
  });


  test('creates a ProgressBar object', () => {
    let bar = new ProgressBar(':bar', { total: 1 });
    expect(bar).toBeDefined();
  });

  test('renders the default bar correctly', (done) => {
    let bar = new ProgressBar(':bar', { total: 5 });
  
    simulateProgressBar(bar, () => {
      expect(stderr).toStrictEqual([
        CLEAR_LINE,
        '=----', CURSOR_TO_START, CLEAR_LINE,
        '==---', CURSOR_TO_START, CLEAR_LINE,
        '===--', CURSOR_TO_START, CLEAR_LINE,
        '====-', CURSOR_TO_START, CLEAR_LINE,
        '=====', CURSOR_TO_START, NEW_LINE
      ]);
      done();
    });
  });

  test('starts at given position', (done) => {
    let bar = new ProgressBar(':bar', { total: 5, curr: 2 });
  
    simulateProgressBar(bar, () => {
      expect(stderr).toStrictEqual([
        CLEAR_LINE,
        '===--', CURSOR_TO_START, CLEAR_LINE,
        '====-', CURSOR_TO_START, CLEAR_LINE,
        '=====', CURSOR_TO_START, NEW_LINE
      ]);
      done();
    }, undefined, 3);
  });

  test('renders the default bar to stdout correctly', (done) => {
    let bar = new ProgressBar(':bar', { total: 5, stream: process.stdout });
  
    simulateProgressBar(bar, () => {
      expect(stdout).toStrictEqual([
        CLEAR_LINE,
        '=----', CURSOR_TO_START, CLEAR_LINE,
        '==---', CURSOR_TO_START, CLEAR_LINE,
        '===--', CURSOR_TO_START, CLEAR_LINE,
        '====-', CURSOR_TO_START, CLEAR_LINE,
        '=====', CURSOR_TO_START, NEW_LINE
      ]);
      done();
    });
  });

  test('renders custom complete chars correctly', (done) => {
    let bar = new ProgressBar(':bar', { total: 3, complete: ':' });
  
    simulateProgressBar(bar, () => {
      expect(stderr).toStrictEqual([
        CLEAR_LINE,
        ':--', CURSOR_TO_START, CLEAR_LINE,
        '::-', CURSOR_TO_START, CLEAR_LINE,
        ':::', CURSOR_TO_START, NEW_LINE
      ]);
      done();
    });
  });

  test('renders custom incomplete chars correctly', (done) => {
    let bar = new ProgressBar(':bar', { total: 3, incomplete: '.' });
  
    simulateProgressBar(bar, () => {
      expect(stderr).toStrictEqual([
        CLEAR_LINE,
        '=..', CURSOR_TO_START, CLEAR_LINE,
        '==.', CURSOR_TO_START, CLEAR_LINE,
        '===', CURSOR_TO_START, NEW_LINE
      ]);
      done();
    });
  });

  test('clears the current line before rendering', (done) => {
    let bar = new ProgressBar(':bar', { total: 3 });
  
    simulateProgressBar(bar, () => {
      expect(stderr[0]).toBe(CLEAR_LINE);
      done();
    });
  });

  test('prints a new line after terminating', (done) => {
    let bar = new ProgressBar(':bar', { total: 3 });
  
    simulateProgressBar(bar, () => {
      expect(stderr[stderr.length - 1]).toBe(NEW_LINE);
      done();
    });
  });

  test('calls callback on completion', (done) => {
    let callback = jest.fn();
    let bar = new ProgressBar(':bar', { total: 1, callback });
    simulateProgressBar(bar, () => {
      expect(callback).toHaveBeenCalled();
      done();
    });
  });

  test('clears bar on completion', (done) => {
    let bar = new ProgressBar(':bar', { total: 1, clear: true });
    simulateProgressBar(bar, () => {
      expect(stderr[stderr.length - 1]).toBe(CLEAR_LINE);
      done();
    });
  });
});
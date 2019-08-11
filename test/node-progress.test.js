const ProgressBar = require('../index');
const intercept = require("intercept-stdout");

const CLEAR_LINE = '\u001b[1G';
const CURSOR_TO_START = '\u001b[0K';
const NEW_LINE = '\n';


test('creates an ProgressBar object', () => {
  let bar = new ProgressBar(':bar', { total: 1 });
  expect(bar).toBeDefined();
});


const simulateProgressBar = (bar, callback, tickDuration = 20) => {
  for (let i = 0; i < bar.total; i++) {
    setTimeout(() => bar.tick(), tickDuration * i);
  }
  setTimeout(callback, (bar.total + 1) * tickDuration);
}

describe('it should render correctly', () => {

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
});
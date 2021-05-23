var ProgressBar = require("..");

// Demonstrates the use of custom tokens with verbose eta

var list = Array(10000)
  .fill(0)
  .map((_, i) => `image_${i + 1}.jpg`);

var bar = new ProgressBar(
  ":percent eta: :veta downloading :current/:total :file",
  {
    total: list.length,
  }
);

var id = setInterval(function () {
  bar.tick({
    file: list[bar.curr],
  });
  if (bar.complete) {
    clearInterval(id);
  }
}, 500);

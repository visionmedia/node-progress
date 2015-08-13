var ProgressBar = require('../index');

var bar = new ProgressBar("Bar:\t:bar [:current/:total]\n:random\nTime:\t:elapsed s", {
	width: 10,
	total: 100,
	tokens: {random: 'First call'}
});

console.log('A visible line');

var count = 0;
var tickId = setInterval(tick, 20);

function tick() {
	if(count === 99) {
		bar.terminate();
		clearInterval(tickId);

		setTimeout(console.log.bind(console, '\nDone!'), 21);
	}

	var bgColor = '\u001b[' + (40 + (Math.random() * 7) | 0) + 'm';
	var fgColor = '\u001b[' + (30 + (Math.random() * 7) | 0) + 'm';
	var end     = '\u001b[m';

	var text = Math.random().toString(36).substr((Math.random() * 13) | 0);

	bar.tokens.random = 'Text:\t' + bgColor + fgColor + text + end;

	bar.tick();
	count++;
}

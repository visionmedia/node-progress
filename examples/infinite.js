var ProgressBar = require('../')
  , bar         = new ProgressBar(':rotary :message :ellipsis', { infinite : true });

bar.start({
	message : 'Waiting for device',
	tick : 200,
	longWaitMessage : 'Please insert a device!',
	longWaitTick : 2000
});

setTimeout(function() {
	bar.finish();
}, 6000);

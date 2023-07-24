const { compute } = require('./factorial');

process.on('message', (msg) => {
	process.send(compute({array: msg}));
	process.disconnect();
})
const notifier = require('node-notifier');

const ms = Number(process.argv[2]) * 1000;

setTimeout(() => {
	notifier.notify(`Таймер сработал не менее чем через ${process.argv[2]} секунд`)
}, ms);

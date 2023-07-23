const ms = Number(process.argv[2]) * 1000;

setTimeout(() => {
	console.log(`Таймер сработал не менее чем через ${process.argv[2]} секунд`)
}, ms);

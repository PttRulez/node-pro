const { Worker } = require('worker_threads');
const perf_hooks = require('perf_hooks');
const { fork } = require('child_process');

workerFunction = perf_hooks.performance.timerify(workerFunction)
forkFunction = perf_hooks.performance.timerify(forkFunction)

const performanceObserver = new perf_hooks.PerformanceObserver((items, observer) => {
	console.log('perf entries:', items.getEntries());
});

performanceObserver.observe({ entryTypes: ['function'] });

function workerFunction (array) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./worker.js', {
			workerData: { array }
		});

		worker.on('message', (msg) => {
			resolve(msg);
		})

		worker.on('error', (err) => {
			reject(err);
		});

		worker.on('exit', () => {
			console.log('Worker завершил работу');
		})
	});
}

function forkFunction (array) {
	return new Promise((resolve, reject) => {
		const forkProcess = fork('fork.js');

		forkProcess.on('message', (msg) => {
			resolve(msg)
		});

		forkProcess.on('close', (code) => {
			console.log(`Fork закрылся: ${code}`);
		})

		forkProcess.send(array);
	});
}

const main = async () => {
	const workerResult = await workerFunction([25, 19, 48, 30]);
	console.log('Worker посчитал:')
	console.log(workerResult)
	const forkResult = await forkFunction([25, 19, 48, 30]);
	console.log('Fork посчитал:')
	console.log(forkResult)
}

main();
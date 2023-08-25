const { PerformanceObserver } = require('perf_hooks');
const calc = require('./calc.js');
const {Worker} = require('worker_threads');
const {cpus} = require('os')

const arr = [];

const performanceObserver = new PerformanceObserver((items, observer) => {
	for (const entry of items.getEntries()) {
		console.log(`${entry.name}: ${entry.duration}`);
	}
});

performanceObserver.observe({ entryTypes: ['measure']});

for (let i = 1; i <= 30_000_000; i++) {
	arr.push(i);
}

function straightCalculation (array) {
	performance.mark('start');

	const result = calc(array);

	console.log('Результат straight:', result);
	performance.mark('end');
	performance.measure('straightCalculation', 'start', 'end');
}

function workerCalculation (array) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./worker.js', {
			workerData: {
				array
			}
		})

		worker.on('message', (msg) => {
			resolve(msg);
		});

		worker.on('error', (err) => {
			reject(err);
		});
	})
}

const workersFunc = async (array) => {
	const arrayOfCalculations =  [];
	for (let i = cpus().length; i > 0; i--) {
		arrayOfCalculations.push(workerCalculation(array.splice(0, Math.ceil(array.length / i))));
	}

	try {
		performance.mark('start');
		const result = await Promise.all(arrayOfCalculations);

		console.log('Результат worker:', result.reduce((prev, cur) => { return prev + cur }, 0))
		performance.mark('end');
		performance.measure('workersFunc', 'start', 'end');

	} catch (e) {
		console.error(e.message)
	}
}

straightCalculation(arr);
workersFunc(arr);
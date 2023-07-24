const { parentPort, workerData } = require('worker_threads');
const calc = require('./calc.js');

const compute = ({ array }) => {
	return calc(array);
}

parentPort.postMessage(compute(workerData))
const arg1 = Number(process.argv[2])
const arg2 = Number(process.argv[3])
const funcName = process.argv[4]

const EventEmitter = require('events')

const myEmitter = new EventEmitter();

const functions = ['add', 'multiple'];

for (const funcName of functions) {
	const func = require(`./${funcName}.js`)

	myEmitter.on(funcName, (a, b) => {
		myEmitter.emit('result', func(a, b));
	})
}

myEmitter.on('result', result => {
	console.log('result:', result)
})

myEmitter.emit(funcName, arg1, arg2)
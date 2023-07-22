const word = 'node'

const result = word.split('').reduce((prev, cur) => {
	return cur + prev;
}, '')

console.log('result:', result)
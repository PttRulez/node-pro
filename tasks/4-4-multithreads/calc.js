module.exports = function calc (array) {
	let result = 0;
	for (const number of array) {
		if (number % 3 === 0) {
			result++;
		}
	}
	return result;
}
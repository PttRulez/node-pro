function factorial(n) {
	if (n === 1 || n === 0) {
		return 1;
	}

	return factorial(n - 1) * n;
}

const compute = ({ array }) => {
	const arr = [];
	for (let i = 0; i < 100_000_000; i++) {
		arr.push(i * i);
	}
	return array.map(el => factorial(el));
};

module.exports = { factorial, compute }
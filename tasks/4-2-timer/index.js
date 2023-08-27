const msMap = {
	's': 1000,
	'm': 1000 * 60,
	'h': 1000 * 60 * 60
}

const parts = process.argv.slice(2);
let ms = 0;

for (const part of parts) {
	if (!/(\d+)(m|s|h)/.test(part)) {
		throw new Error('Неправильный формат времени. Можно использовать только цифры + s/m/h. Например 2h 6m 40s')
	}
	const [time, number, multiplier] = part.match(/(\d+)(m|s|h)/)
	ms += number * msMap[multiplier]
}

const seconds = ms / 1000

console.log(`Таймер должен сработать не менее чем через ${seconds} секунд`)

setTimeout(() => {
	console.log(`Таймер сработал не менее чем через ${seconds} секунд`)
}, ms);

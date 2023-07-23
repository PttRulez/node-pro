// import log, { characters, greet } from "./characters.mjs";
//
// for (const c of characters) {
// 	greet(c)
// }
//
// log()

// асинхронный импорт
async function main() {
	try {
		const {characters, greet} = await import('./characters.mjs')
		for (const c of characters) {
			greet(c)
		}
	}	catch(e) {
		console.log("Ошибка")
	}

}

main();

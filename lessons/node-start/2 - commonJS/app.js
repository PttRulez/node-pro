const { stealRing, characters } = require('./characters.js')

let myChars = characters;

myChars = stealRing(myChars, 'Фродо')
 
for (const c of characters) {
	console.log(c)
}

console.log('myChars', myChars)
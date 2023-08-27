const arg1 = Number(process.argv[2])
const arg2 = Number(process.argv[3])
const funcName = process.argv[4]
const func = require(`./${funcName}.js`)
console.log('result:', func(arg1,arg2))
const conf = require('@open-hearth/config')
const name = process.argv[2]
console.log(conf[name] || '')

const repl = require('repl')
console.log('> Models loaded on `models` global variable')
repl.start('> ').context.models = require('./models')

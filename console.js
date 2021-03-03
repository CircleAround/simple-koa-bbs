const repl = require('repl')
const context = repl.start('> ').context
context.models = require('./models')
console.log('> Models loaded on `models` global variable')

// TODO: 本当はメールが必要なら初期化。あとこの部分共通化する？
const mail = require('./lib/mail')
const mailConfig = require('./config/mail')()
mail.initMail(mailConfig).then(()=>{
  context.mailers = require('./mailers')
  console.log('> Mailers loaded on `mailers` global variable')
})


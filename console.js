const repl = require('repl')
const context = repl.start('> ').context
const boot = require('./boot')
boot()

context.models = require('./models')
console.log('> Models loaded on `models` global variable')

const initializer = require('./config/initializer')
initializer().then(()=>{
  context.mailers = require('./mailers')
  console.log('> Mailers loaded on `mailers` global variable')

  context.queues = require('./lib/job')
  context.jobs = require('./jobs')
  console.log('> Queues loaded on `queues` global variable')
  console.log('> Jobs loaded on `jobs` global variable')
})


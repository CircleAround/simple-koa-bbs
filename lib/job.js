const ex = module.exports = {}

const Queue = require('bull')

const { setQueues, BullAdapter } = require('bull-board')
const app = require('../app')

// TODO: あとでちゃんと書く
// options の基本構造はBullのオプションのまま
// 追加として queueOptions=Record<string, QueueOptions>
// QueueOptionsはBullオプションと同じ形式で、デフォルトのオプションをキューごとに上書きできる
// optionsを配列で渡した場合、0番目がRedisのURL扱い、1番目がオプション扱いされる

let _queues
async function initJob(options) {
  // TODO: 配列の場合にはRedisURLとオプションの組み合わせ Bullに合わせたが将来は変えたい
  if(options instanceof Array) {
    [redisUrl, options] = options
  }

  const initialQueues = {}
  const { queueOptions, ...globalOptions } = options
  const names = Object.keys(queueOptions)
  names.forEach((name)=>{
    const queueOption = queueOptions[name] || {}
    const queue = new Queue(name, { ...globalOptions, ...queueOption })
    initialQueues[name] = queue
  })
  _queues = initialQueues
  setQueues(Object.keys(_queues).map((name)=>{ return new BullAdapter(_queues[name]) }))

  initAutoProcess()
}

function queueNames() {
  if(!_queues) { throw new Error('initJob is not complete') }
  return Object.keys(_queues)
}

function queues() {
  if(!_queues) { throw new Error('initJob is not complete') }
  return _queues
}

function enqueue(type, methodName, params, queueName) {
  const queue = queues()[type]
  if(!queue) {
    throw new Error(`Queue named "${type}" is not found`)
  }

  if(queueName) {
    queue.add(queueName, { methodName, params })
  } else {
    queue.add({ methodName, params })
  }
}

function initAutoProcess(type='mailers') {
  queues()[type].process(async (job)=>{
    const methodName = job.data.methodName
    const methods = methodName.split('.')
    let method = app[type]
    methods.forEach((m) => {
      method = method[m]
      if(!method) {
        throw new Error(`method not found: ${type}.${methodName}`)
      }
    })
  
    console.log(`call ${type}.${methodName}(${job.data.params})`)
    await method(job.data.params)
  })
}

ex.initJob = initJob
ex.queues = queues
ex.queueNames = queueNames
ex.enqueue = enqueue
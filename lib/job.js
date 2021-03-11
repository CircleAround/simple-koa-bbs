const Queue = require('bull')

const { setQueues, BullAdapter } = require('bull-board')

// TODO: あとでちゃんと書く
// options の基本構造はBullのオプションのまま
// 追加として queueOptions=Record<string, QueueOptions>
// QueueOptionsはBullオプションと同じ形式で、デフォルトのオプションをキューごとに上書きできる
// optionsを配列で渡した場合、0番目がRedisのURL扱い、1番目がオプション扱いされる

let _queues
async function initJob(options) {
  // TODO: 配列の場合にはRedisURLとオプションの組み合わせ Bullに合わせたが将来は変えたい
  let redisUrl
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
}

function enqueue(name, body) {
  if(!_queues) { throw new Error('initJob is not complete') }

  const queue = _queues[name]
  if(!queue) { throw new Error(`queue[${name}] is not defined`) }
  queue.process(name, async (job)=>{
    // TODO: 例外したときにログだけ出すなど、対応する
    return body(job)
  })
}

function queueNames() {
  if(!_queues) { throw new Error('initJob is not complete') }
  return Object.keys(_queues)
}

function queues() {
  if(!_queues) { throw new Error('initJob is not complete') }
  return _queues
}

module.exports = { initJob, queues, queueNames }
const EventEmitter = require('events')

const Queue = require('bull')
const bullBoard = require('bull-board')

const { setQueues, BullAdapter } = require('bull-board')
const app = require('../app/')

class MockQueue extends EventEmitter {
  #handler

  async add(queueName, params) {
    if(!params) { params = queueName }

    return this.#handler({
      data: params
    })
  }

  process(handler) {
    this.#handler = handler
  }

  close() {
    // nop
  }
}

class WorkerExtension {
  #queues

  get expressRouter() {
    return bullBoard.router
  }

  get component() {
    return {
      // TODO: あとでちゃんと書く
      // options の基本構造はBullのオプションのまま
      // 追加として queueOptions=Record<string, QueueOptions>
      // QueueOptionsはBullオプションと同じ形式で、デフォルトのオプションをキューごとに上書きできる
      // optionsを配列で渡した場合、0番目がRedisのURL扱い、1番目がオプション扱いされる

      initialize: async ({ options, queueOptions, mock }) => {
        let redisUrl
        // TODO: 配列の場合にはRedisURLとオプションの組み合わせ Bullに合わせたが将来は変えたい
        if (options instanceof Array) {
          [redisUrl, options] = options
        }

        const initialQueues = {}
        const globalOptions = options
        const queueNames = Object.keys(queueOptions)
        queueNames.forEach((queueName) => {
          console.log(`create queue: ${queueName}`)

          let queueOption = queueOptions[queueName] || {}
          queueOption = { ...globalOptions, ...queueOption }
          const queue = mock ? new MockQueue() : this.createQueue(queueName, redisUrl, queueOption)
          queue.on("error", (err) => {
            console.error(`Queue error: ${queueName}`)
            console.error(err)
            // TODO: エラーハンドリングで通知するなどする？
          })

          queue.on('completed', async (job, actionId) => {
            console.log(`Job completed with result Queue: ${queueName} job.id: ${job.id}; actionId: ${actionId}`);
          })
          queue.on("failed", (job, err) => {
            console.error(`Queue failed: ${queueName}`)
            console.error(job.id, err)
            // TODO: エラーハンドリングで通知するなどする？
          })

          if(queueOption.autoProcessor) {
            queue.process(this.getAutoProcessHandler(queueName))
          }

          initialQueues[queueName] = queue
        })
        this.#queues = initialQueues
        setQueues(Object.keys(this.#queues).map((name) => { return new BullAdapter(this.#queues[name]) }))
      },

      dispose: async () => {
        await Promise.all(Object.values(this.queues()).map((queue)=>{ return queue.close() }))
      }
    }
  }

  queueNames() {
    if (!this.#queues) { throw new Error('initialize is not completed') }
    return Object.keys(this.#queues)
  }

  queues() {
    if (!this.#queues) { throw new Error('initialize is not completed') }
    return this.#queues
  }

  enqueue(type, methodName, args, processorName) {
    const queue = this.queues()[type]
    if (!queue) {
      throw new Error(`Queue named "${type}" is not found`)
    }

    if (processorName) {
      return queue.add(processorName, { methodName, args })
    } else {
      return queue.add({ methodName, args })
    }
  }

  getAutoProcessHandler(moduleName) {
    return async (job) => {
      const methodName = job.data.methodName
      const methods = methodName.split('.')
      let method = this.moduleOf(moduleName)
      if(!method) {
        throw new Error(`Module not found: ${moduleName}`)
      }

      methods.forEach((m) => {
        method = method[m]
        if (!method) {
          throw new Error(`Method not found: ${moduleName}.${methodName}`)
        }
      })

      if(job.data.args instanceof Array) {
        console.log(`call ${moduleName}.${methodName}(${job.data.args.map(arg=>JSON.stringify(arg)).join(',')})`)
        await method.apply(undefined, job.data.args)
      } else {
        console.log(`call ${moduleName}.${methodName}(${JSON.stringify(job.data.args)})`)
        await method(job.data.args)
      }
    }
  }

  // [protected]
  moduleOf(type) {
    return app[type]
  }

  createQueue(name, redisUrl, queueOption) {
    return redisUrl ? new Queue(name, redisUrl, queueOption) : new Queue(name, queueOption)
  }
}

module.exports = new WorkerExtension()

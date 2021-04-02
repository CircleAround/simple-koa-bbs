const Queue = require('bull')
const bullBoard = require('bull-board')

const { setQueues, BullAdapter } = require('bull-board')
const app = require('../app/')

const EventEmitter = require('events');
class MockQueue extends EventEmitter {
  #handler

  async add(queueName, params) {
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

      initialize: async (options) => {
        let redisUrl
        // TODO: 配列の場合にはRedisURLとオプションの組み合わせ Bullに合わせたが将来は変えたい
        if (options instanceof Array) {
          [redisUrl, options] = options
        }

        const initialQueues = {}
        const { queueOptions, ...globalOptions } = options
        const names = Object.keys(queueOptions)
        names.forEach((name) => {
          console.log(`create queue: ${name}`)

          let queueOption = queueOptions[name] || {}
          queueOption = { ...globalOptions, ...queueOption }
          const queue = this.createQueue(name, redisUrl, queueOption)
          queue.on("error", (err) => {
            console.error(`Queue error: ${name}`)
            console.error(err)
            // TODO: エラーハンドリングで通知するなどする？
          })

          queue.on('completed', async (job, actionId) => {
            console.log(`Job completed with result Queue: ${name} job.id: ${job.id}; actionId: ${actionId}`);
          })
          queue.on("failed", (job, err) => {
            console.error(`Queue failed: ${name}`)
            console.error(job.id, err)
            // TODO: エラーハンドリングで通知するなどする？
          })

          initialQueues[name] = queue
        })
        this.#queues = initialQueues
        setQueues(Object.keys(this.#queues).map((name) => { return new BullAdapter(this.#queues[name]) }))

        await this.#initAutoProcess()
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

  enqueue(type, methodName, params, queueName) {
    const queue = this.queues()[type]
    if (!queue) {
      throw new Error(`Queue named "${type}" is not found`)
    }

    if (queueName) {
      queue.add(queueName, { methodName, params })
    } else {
      queue.add({ methodName, params })
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

      console.log(`call ${moduleName}.${methodName}(${job.data.params})`)
      await method(job.data.params)
    }
  }

  async dispose() {
    await Promise.all(Object.values(this.queues()).map((queue)=>{ return queue.close() }))
  }

  // [protected]
  moduleOf(type) {
    return app[type]
  }

  createQueue(name, redisUrl, queueOption) {
    if(process.env.NODE_ENV == 'test') {
      return new MockQueue()
    } else {
      return redisUrl ? new Queue(name, redisUrl, queueOption) : new Queue(name, queueOption)
    }
  }

  async #initAutoProcess(type = 'mailers') {
    this.queues()[type].process(this.getAutoProcessHandler(type))
  }
}

module.exports = new WorkerExtension()

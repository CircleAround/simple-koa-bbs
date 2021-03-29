const Queue = require('bull')
const bullBoard = require('bull-board')

const { setQueues, BullAdapter } = require('bull-board')
const app = require('../app/')

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
          let queueOption = queueOptions[name] || {}
          queueOption = { ...globalOptions, ...queueOption }
          const queue = redisUrl ? new Queue(name, redisUrl, queueOption) : new Queue(name, queueOption)
          initialQueues[name] = queue
        })
        this.#queues = initialQueues
        setQueues(Object.keys(this.#queues).map((name) => { return new BullAdapter(this.#queues[name]) }))

        await this.#initAutoProcess()
      }
    }
  }

  queueNames() {
    if (!this.#queues) { throw new Error('initialize is not complete') }
    return Object.keys(this.#queues)
  }

  queues() {
    if (!this.#queues) { throw new Error('initialize is not complete') }
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

  // [protected]
  moduleOf(type) {
    return app[type]
  }

  async #initAutoProcess(type = 'mailers') {
    this.queues()[type].process(this.getAutoProcessHandler(type))
  }
}

module.exports = new WorkerExtension()

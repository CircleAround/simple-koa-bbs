const models = require('../../app/models')

class FixtureHelper {
  static globalCounter = {}

  static increament(modelName) {
    if(!FixtureHelper.globalCounter[modelName]) {
      FixtureHelper.globalCounter[modelName] = 0
    }
    return FixtureHelper.globalCounter[modelName]++
  }

  #modelName
  #optionCallback
  constructor(modelName, optionCallback) {
    this.#modelName = modelName
    this.#optionCallback = optionCallback
  }

  next(options) {
    return this.#optionCallback(FixtureHelper.increament(this.#modelName), options)
  }

  async create(options = {}) {
    options = {...this.next(), ...options}
    return await models[this.#modelName].create(options)
  }

  async bulkCreate(count = 3, options) {
    const params = []
    for(let i = 0; i < count; ++i) {
      params.push(this.next(options))
    }
    return await models[this.#modelName].bulkCreate(params)
  }
}

module.exports = FixtureHelper

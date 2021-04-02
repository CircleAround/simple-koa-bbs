const models = require('../../app/models')

let globalCounter = 0
module.exports = {
  createSequential: async (modelName, optionCallback, count = 3) => {
    const options = []
    for(let i = 0; i < count; ++i) {
      options.push(optionCallback(++globalCounter))
    }
    await models[modelName].bulkCreate(options)
  }
}

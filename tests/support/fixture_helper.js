const models = require('../../app/models')

module.exports = {
  createSequential: async (modelName, optionCallback, count = 3) => {
    const options = []
    for(let i = 0; i < count; ++i) {
      options.push(optionCallback(i))
    }
    await models[modelName].bulkCreate(options)
  }
}

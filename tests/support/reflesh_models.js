const models = require('../../app/models')

module.exports = async (modelNames) => {
  for(const modelName of modelNames) {
    console.log(`drop: ${modelName}`)
    await models[modelName].sync({ force: true })
  }
}

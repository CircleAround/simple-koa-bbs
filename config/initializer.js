const path = require('path')

const { initialize } = require('../lib/platform')

module.exports = async (options = {}) => {
  return await initialize(
    path.join(__dirname, '../extensions'), 
    path.join(__dirname, '../config/extensions'), 
    options.targets
  )
}
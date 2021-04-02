const path = require('path')

const { initialize } = require('../lib/autoload')

module.exports = async () => {
  return await initialize(
    path.join(__dirname, '../extensions'), 
    path.basename(__filename),
    path.join(__dirname, '../config/extensions'), 
  )
}
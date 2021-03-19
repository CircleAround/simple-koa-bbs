const fs = require('fs')

module.exports = () => {
  if (fs.existsSync('./.env')) {
    const result = require('dotenv').config()
    if (result.error) {
      throw result.error
    }
  }
}

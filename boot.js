module.exports = () => {
  const fs = require('fs')
  if (fs.existsSync('./.env')) {
    const result = require('dotenv').config()
    if (result.error) {
      throw result.error
    }
  }
}
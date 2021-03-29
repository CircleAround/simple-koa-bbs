const fs = require('fs')
const path = require('path')

module.exports = () => {
  const rootDir = path.join(__dirname, '../')
  const envPath = path.join(rootDir, '.env')

  if (fs.existsSync(envPath)) {
    console.log(`> read ${envPath}`)
    const result = require('dotenv').config()
    if (result.error) {
      throw result.error
    }
  }
}

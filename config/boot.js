const fs = require('fs')
const path = require('path')

process.on('uncaughtException', function (err) {
  console.error(err)
  console.error(err.stack)
})

module.exports = () => {
  const rootDir = path.join(__dirname, '../')
  const envPath = path.join(rootDir, (process.env.NODE_ENV === 'test') ? '.env.test' : '.env')

  if (fs.existsSync(envPath)) {
    const result = require('dotenv').config()
    if (result.error) {
      throw result.error
    }
    console.log(`> read ${envPath}`)
  }
}

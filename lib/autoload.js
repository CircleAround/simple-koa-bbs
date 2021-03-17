const fs = require('fs')
const path = require('path')

function traverse(callback, dir, basename) {
  const results = []
  fs
    .readdirSync(dir)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(file => {
      results.push(callback(file, dir))
    })
  return results
}

function autoload(ex, dir, basename) {
  return traverse((file, dir) => {
    return ex[file] = require(path.join(dir, file))
  }, dir, basename)
}

function initialize(dir, basename, configDir = path.join(dir, '../config')) {
  console.log('initialize...')
  const initializers = traverse((file, dir) => {
    const extensionPath = path.join(dir, file)
    const extension = require(extensionPath)
    console.log(`> find extension at ${extensionPath}`)
    const config = require(path.join(configDir, file))() //TODO: config dir to config 

    if (extension && extension.component && extension.component.initialize) {
      console.log('  call extension.component.initialize')
      return extension.component.initialize(config)
    } else {
      return Promise.resolve()
    }
  }, dir, basename)

  return Promise.all(initializers).then(() => { console.log('initialized') })
}

module.exports = { autoload, traverse, initialize }

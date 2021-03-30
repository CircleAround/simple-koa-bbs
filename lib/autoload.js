const fs = require('fs')
const path = require('path')

// TODO: 後でカスタム可能にする。jestの__mock__を弾いている
function isExcludedFile(file) {
  return file.substr(0, 2) === '__'
}

function traverse(callback, dir, basename) {
  const results = []
  fs
    .readdirSync(dir)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && !isExcludedFile(file)
    })
    .forEach(file => {
      results.push(callback(file, dir))
    })
  return results
}

function autoload(ex, dir, basename) {
  return traverse((file, dir) => {
    let name
    if(file.substr(-3) === '.js') { 
      name = file.substr(0, file.length - 3)
    } else {
      name = file
    }
    return ex[name] = require(path.join(dir, file))
  }, dir, basename)
}

async function initialize(dir, basename, configDir = path.join(dir, '../config')) {
  console.log('initialize...')
  const initializers = traverse(async (file, dir) => {

    try {
      const extensionPath = path.join(dir, file)
      const extension = require(extensionPath)
      console.log(`> find extension at ${extensionPath}`)
  
      if(!extension) { throw new Error('extension must export instance') }
      if(!extension.component) { throw new Error('extension must export { component }') }
  
      if (extension.component.initialize) {
        console.log('  call extension.component.initialize')
        const config = await require(path.join(configDir, file))()
        return await extension.component.initialize(config, configDir)
      }
    } catch(e) {
      console.error(e.message)
      console.error(e.stack)
    }
  }, dir, basename)

  await Promise.all(initializers)
  console.log('initialized\n')
}

module.exports = { autoload, traverse, initialize }

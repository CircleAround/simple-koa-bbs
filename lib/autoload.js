const fs = require('fs')
const path = require('path')

const _extensions = []

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

async function initialize(dir, basename, configDir = path.join(dir, '../config'), targets) {
  console.log('initialize...')

  if(targets) {
    console.log(`targets is specified: ${targets}`)
  }

  const initializers = traverse(async (file, dir) => {
    console.log(`traverse: ${file}`)
    if(targets) {
      if(!targets.includes(file)) { 
        console.log(`ignored: ${file}`)
        return
      }
    }

    const extensionPath = path.join(dir, file)

    try {
      const extension = require(extensionPath)
      console.log(`> find extension at ${extensionPath}`)
  
      if(!extension) { throw new Error('extension must export instance') }
      if(!extension.component) { throw new Error('extension must export { component }') }
  
      if (extension.component.initialize) {
        console.log('  call extension.component.initialize')
        const config = await require(path.join(configDir, file))()
        await extension.component.initialize(config, configDir)
      }

      _extensions.push(extension)
    } catch(e) {
      console.error(`initialize failed for ${extensionPath}`)
      throw e
    }
  }, dir, basename)

  await Promise.all(initializers)
  console.log('initialized\n')
}

async function dispose() {
  console.log(_extensions)
  return await Promise.all( _extensions.map(extension => extension.dispose()) ) 
}

module.exports = { autoload, traverse, initialize, dispose }

const fs = require('fs')
const path = require('path')

const debug = require('debug')('platform')

const _extensions = []

// TODO: 後でカスタム可能にする。jestの__mock__を弾いている
function isExcludedFile(file) {
  return file.substr(0, 2) === '__'
}

function traverse(callback, dir, isExcluded = isExcludedFile) {
  const results = []
  fs
    .readdirSync(dir)
    .filter(file => {
      return (file.indexOf('.') !== 0) && !isExcluded(file)
    })
    .forEach(file => {
      results.push(callback(file, dir))
    })
  return results
}

function autoload(ex, dir, basename) {
  const isExcluded = (file) => {
    return (file === basename) || isExcludedFile(file)
  }

  return traverse((file, dir) => {
    let name
    if(file.substr(-3) === '.js') { 
      name = file.substr(0, file.length - 3)
    } else {
      name = file
    }
    return ex[name] = require(path.join(dir, file))
  }, dir, isExcluded)
}

async function initialize(dir, configDir = path.join(dir, '../config'), targets) {
  debug('initialize...')

  if(targets) {
    debug(`targets is specified: ${targets}`)
  }

  const initializers = traverse(async (file, dir) => {
    debug(`traverse: ${file}`)
    if(targets) {
      if(!targets.includes(file)) { 
        debug(`ignored: ${file}`)
        return
      }
    }

    const extensionPath = path.join(dir, file)

    try {
      const extension = require(extensionPath)
      debug(`> find extension at ${extensionPath}`)
  
      if(!extension) { throw new Error('extension must export instance') }
      if(!extension.component) { throw new Error('extension must export { component }') }
  
      if (extension.component.initialize) {
        debug('  call extension.component.initialize')
        const config = await require(path.join(configDir, file))()
        await extension.component.initialize(config, configDir)
      }

      _extensions.push(extension)
    } catch(e) {
      console.error(`initialize failed for ${extensionPath}`)
      throw e
    }
  }, dir)

  await Promise.all(initializers)
  debug('initialized\n')
}

async function dispose() {
  return await Promise.all( _extensions.map(async (extension) => { 
    if(!extension.component) { throw new Error('extension must export { component }') }
    if(extension.component.dispose) {
      return await extension.component.dispose()
    }
  })) 
}

module.exports = { autoload, traverse, initialize, dispose }

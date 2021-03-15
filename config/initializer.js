const names = ['mail', 'job'] // TODO: この取得を自動にする

function initialize() {
  const initializers = names.map((name)=>{ 
    const extension = require(`../extensions/${name}`)
    const config = require(`../config/${name}`)()
    return extension.component.initialize(config)
  })

  return Promise.all(initializers)
}

module.exports = initialize
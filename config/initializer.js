const names = ['mail', 'job', 'storage'] // TODO: この取得をextensionsディレクトリから自動で取る

function initialize() {
  const initializers = names.map((name)=>{ 
    const extension = require(`../extensions/${name}`)
    const config = require(`../config/${name}`)()
    return extension.component.initialize(config)
  })

  return Promise.all(initializers)
}

module.exports = initialize
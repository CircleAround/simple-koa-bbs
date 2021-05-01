const boot = require('./config/boot')
boot()

const debug = require('debug')('platform:console')
const repl = require('repl')

const app = require('./app/')
const fs = require('fs')

const initializer = require('./config/initializer')
initializer().then(() => {
  function initContext(context) {
    debug('loading app features...')
    for (const key of Object.keys(app)) {
      debug(`> "${key}" loaded on global`)
      context[key] = app[key]
    }
    context.app = app
    debug('> app features loaded!\n')

    replServer.displayPrompt(true)
  }

  const replServer = repl.start({ useColors: true })
  replServer.on('reset', initContext)
  enableHistory(replServer)

  initContext(replServer.context)
})

// @see https://qiita.com/acro5piano/items/dc62b94d7b04505a4aca
function enableHistory(replServer) {
  const replHistoryPath = `${process.env.HOME}/.node_repl_history`
  if (!fs.existsSync(replHistoryPath)) {
    fs.writeFile(replHistoryPath, '', (err) => {
      if (err) {
        debug(err.stack)
        throw err
      }
    })
  }

  fs.readFile(replHistoryPath, 'utf8', (err, data) =>
    data.split('\n').forEach(command =>
      replServer.history.push(command)
    )
  )

  replServer.on('exit', () => {
    fs.writeFile(replHistoryPath, replServer.history.join('\n'), err => {
      console.error(err)
      process.exit()
    })
  })
}

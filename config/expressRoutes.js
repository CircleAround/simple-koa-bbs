const worker = require('../extensions/worker')

module.exports = async function (expressApp) {
  if (process.env.NODE_ENV == 'production') {
    expressApp.use('/admin/queues', worker.expressRouter) // TODO: アクセス制限
  } else {
    expressApp.use('/admin/queues', worker.expressRouter)
  }
}
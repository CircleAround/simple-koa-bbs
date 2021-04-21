const worker = require('../extensions/worker')
const logger = require('morgan');

module.exports = async function (expressApp) {
  if (process.env.NODE_ENV == 'production') {
    expressApp.use(logger('common'))
    expressApp.use('/admin/queues', worker.expressRouter) // TODO: アクセス制限
  } else {
    expressApp.use(logger('dev'))
    expressApp.use('/admin/queues', worker.expressRouter)
  }
}
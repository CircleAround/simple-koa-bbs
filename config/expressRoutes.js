const worker = require('../extensions/worker')
const mail = require('../extensions/mail')

module.exports = async function (expressApp, port) {
  if (process.env.NODE_ENV == 'production') {
    expressApp.use('/admin/queues', worker.expressRouter) // TODO: アクセス制限
  } else {
    if(mail.canUseDebugMiddleware()) {
      expressApp.use(await mail.getDebugExpressMiddleware('/letter_opener', port))
    }
    
    expressApp.use('/admin/queues', worker.expressRouter)
  }
}
const worker = require('../../extensions/worker')

const sendConfirmationMail = function (params){
  return worker.enqueue('mailers', 'auth.sendConfirmationMail', params)
}

module.exports = { sendConfirmationMail }
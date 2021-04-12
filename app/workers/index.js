const worker = require('../../extensions/worker')

const sendConfirmationMail = function (params){
  return worker.enqueue('mailers', 'auth.sendConfirmationMail', params)
}

const sendConfirmationMailArray = function (params){
  return worker.enqueue('mailers', 'auth.sendConfirmationMail', [params, 1])
}


module.exports = { sendConfirmationMail, sendConfirmationMailArray }
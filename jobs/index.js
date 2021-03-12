const job = require('../lib/job')

const sendConfirmationMail = async function (params){
  job.enqueue('mailers', 'auth.sendConfirmationMail', params)
}

module.exports = { sendConfirmationMail }
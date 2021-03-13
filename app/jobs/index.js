const job = require('../../lib/job')

const sendConfirmationMail = function (params){
  console.log(job)
  job.enqueue('mailers', 'auth.sendConfirmationMail', params)
}

module.exports = { sendConfirmationMail }
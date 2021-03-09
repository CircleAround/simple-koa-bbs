const mail = require('../lib/mail')
const mailConfig = require('../config/mail')()

const job = require('../lib/job')
const jobConfig = require('../config/job')()

function initialize() {
  return Promise.all([
    mail.initMail(mailConfig), 
    job.initJob(jobConfig)
  ])
}

module.exports = initialize
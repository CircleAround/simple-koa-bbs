const nodemailer = require("nodemailer");

let transporter

async function initMail(options) {
  options = options || await etherealOptions()

  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport(options)

  // console.log(transporter)
  return transporter
}

async function etherealOptions() {
  const account = await nodemailer.createTestAccount()

  return {
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass, // generated ethereal password
    },
  }
}

function mailer() {
  if(!transporter) { throw new Error('mailer must initialze. call initMail()') }
  return transporter
}

module.exports = { initMail, mailer }
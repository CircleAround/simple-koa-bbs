const { createMailer } = require('../../lib/mailer')

const mailer = createMailer({ rootDir: __dirname })

const sendConfirmationMail = async (user) => {
  return mailer.send({
    key: 'confirmation',
    to: user.email, 
    subject: "[SimpleBBS]ユーザー登録確認"
  })
}

module.exports = { sendConfirmationMail }

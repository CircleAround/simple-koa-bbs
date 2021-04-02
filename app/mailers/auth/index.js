const { createMailer } = require('../../../extensions/mail')
const db = require('../../models')
const User = db.user

let mailer

const sendConfirmationMail = async ({userId}) => {
  const user = await User.findByPk(userId)
  if(!user) {  
    throw new Error(`User not found: id=${userId}`)
  }

  return getMailer().send({
    key: 'confirmation',
    to: user.email, 
    subject: "[SimpleBBS]ユーザー登録確認",
    data: user
  })
}

const getMailer = () => {
  if(!mailer) { 
    mailer = createMailer({ rootDir: __dirname })
  }
  return mailer  
}

module.exports = { 
  getMailer,
  sendConfirmationMail
}

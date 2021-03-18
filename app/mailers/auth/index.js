const { createMailer } = require('../../../extensions/mail')
const db = require('../../models')
const User = db.user

const sendConfirmationMail = async ({userId}) => {
   // TODO: initializeが終わったらコールされるイベントを作って、そこで呼ばせる方が良いかもしれない
  const mailer = createMailer({ rootDir: __dirname })

  const user = await User.findByPk(userId)
  if(!user) {  
    throw new Error(`User not found: id=${userId}`)
  }

  return mailer.send({
    key: 'confirmation',
    to: user.email, 
    subject: "[SimpleBBS]ユーザー登録確認",
    data: user
  })
}

module.exports = { sendConfirmationMail }

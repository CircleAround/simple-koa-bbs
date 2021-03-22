const { createMailer } = require('../../extensions/mail')

const sendTestMail = async () => {
   // TODO: initializeが終わったらコールされるイベントを作って、そこで呼ばせる方が良いかもしれない
  const mailer = createMailer({ rootDir: __dirname })
  return mailer.send({
    text: 'this is testmail',
    html: '<p>this is testmail</p>',
    to: 'test@example.com', 
    subject: "This is test mail"
  })
}

module.exports = { sendTestMail }

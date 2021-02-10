const { ValidationError } = require('sequelize')
const mail = require('../../lib/mail')
const db = require('../../models')
const User = db.user

const renderIndex = async (ctx, params, error = null) => {
  await ctx.render('auth/accounts/index', { params, error })
}

const index = async ctx => {
  sendConfirmationMail({email: 'test@example.com'}) // TODO: This is test
  await renderIndex(ctx, {})
}

const create = async ctx => {
  const { email, password, nickName } = ctx.request.body
  const params = { email, password, nickName }

  try {
    const user = await User.register(params)
    sendConfirmationMail(user)
    ctx.redirect('/login')
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e)
      return await renderIndex(ctx, params, e)
    }

    throw e
  }
}

const sendConfirmationMail = async (user) => {
  // send mail with defined transport object
  let info = await mail.mailer().sendMail({
    from: '"SimpleBBS" <noreply@example.com>', // sender address
    to: user.email, // list of receivers
    subject: "[SimpleBBS]ユーザー登録確認", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = { index, create }
const authMailer = require('../../mailers/auth')
const { ValidationError } = require('sequelize')
const db = require('../../models')
const User = db.user

const renderIndex = async (ctx, params, error = null) => {
  await ctx.render('auth/accounts/index', { params, error })
}

const index = async ctx => {
  authMailer.sendConfirmationMail({email: 'test@example.com'}) // TODO: This is test
  await renderIndex(ctx, {})
}

const create = async ctx => {
  const { email, password, nickName } = ctx.request.body
  const params = { email, password, nickName }

  try {
    const user = await User.register(params)
    authMailer.sendConfirmationMail(user)
    ctx.redirect('/login')
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e)
      return await renderIndex(ctx, params, e)
    }

    throw e
  }
}

module.exports = { index, create }
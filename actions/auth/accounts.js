const jobs = require('../../app/jobs')
const { ValidationError } = require('sequelize')
const db = require('../../app/models')
const User = db.user
const UserConfirmation = db.userConfirmation

const renderIndex = async (ctx, params, error = null) => {
  await ctx.render('auth/accounts/index', { params, error })
}

const index = async ctx => {
  await renderIndex(ctx, {})
}

const create = async ctx => {
  const { email, password, nickName } = ctx.request.body
  const params = { email, password, nickName } // for mass assignment

  try {
    const user = await User.register(params)
    jobs.sendConfirmationMail({ userId: user.id })
    ctx.redirect('/login')
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e)
      return await renderIndex(ctx, params, e)
    }

    throw e
  }
}

const confirm = async ctx => {
  const { token } = ctx.request.query
  if(!token || token.length === 0) { throw new Error('Invalid Access') } // TODO: 403エラーを作る

  const userConfirmation = await UserConfirmation.findOne({ where: { token: token } })
  if(!userConfirmation) {
    throw new Error('Invalid token') // TODO: エラー対応ちゃんとやる
  }

  await userConfirmation.succeed()
  ctx.flash = { info: 'メール確認が正常に行えました。ログインしてください' }
  ctx.redirect('/login')
}

module.exports = { index, create, confirm }
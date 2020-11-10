const {DataTypes, ValidationError} = require('sequelize')
const db = require('../../models/')
const Authenticator = require('../../models/user/authenticator')(db.sequelize, DataTypes)
const User = db.user

const renderIndex = async (ctx, params = {}, error = null) => {
  await ctx.render('auth/sessions/index', { params, error })
}

const index = async ctx => {
  await renderIndex(ctx)
}

const create = async ctx => {
  const { email, password } = ctx.request.body
  const params = { email, password }
  try {
    const authenticator = Authenticator.build(params)
    const user = await authenticator.save()
    await ctx.regenerateSession()
    ctx.session.userId = user.id
    ctx.flash = { info: 'ログイン成功しました' }
    ctx.redirect('/')
  } catch (e) {
    if(e instanceof ValidationError) {
      console.log(e)
      return await renderIndex(ctx, params, e)
    }

    throw e
  }
}

const destroy = async (ctx, next) => {
  const currentUser = ctx.currentUser
  if(currentUser) {
    await currentUser.destroy()
  }

  ctx.session = {};
  await ctx.regenerateSession();
  ctx.flash = { info: 'ログアウトしました' }
  ctx.redirect('/login')
}

const currentUser = async (ctx, next) => {
  if(ctx.session.userId) {
    ctx.state.currentUser = await User.findByPk(ctx.session.userId)
  } else {
    ctx.state.currentUser = null
  }
  await next()
}

module.exports = { index, create, destroy, currentUser }
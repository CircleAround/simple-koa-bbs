const {DataTypes, ValidationError} = require('sequelize')
const db = require('../../models/')
const Authenticator = require('../../models/user/authenticator')(db.sequelize, DataTypes)

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
    ctx.redirect('/')
  } catch (e) {
    if(e instanceof ValidationError) {
      console.log(e)
      return await renderIndex(ctx, params, e)
    }

    throw e
  }
}

module.exports = { index, create }
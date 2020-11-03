const { ValidationError } = require('sequelize')
const db = require('../../models')

const renderIndex = async (ctx, params, error = null) => {
  await ctx.render('auth/accounts/index', { params, error })
}

const index = async ctx => {
  await renderIndex(ctx, {})
}

const create = async ctx => {
  const { email, password } = ctx.request.body
  const params = { email, password }
  try {
    const user = await db.User.register(params)
    ctx.redirect('/login')
  } catch (e) {
    if(e instanceof ValidationError) {
      console.log(e)
      return await renderIndex(ctx, params, e)
    }

    throw e
  }
}

module.exports = { index, create }
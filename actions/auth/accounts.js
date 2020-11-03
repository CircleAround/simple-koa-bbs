const { ValidationError } = require('sequelize')
const db = require('../../models')
<<<<<<< HEAD
const User = db.user
=======
>>>>>>> signup and login

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
<<<<<<< HEAD
    const user = await User.register(params)
=======
    const user = await db.User.register(params)
>>>>>>> signup and login
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
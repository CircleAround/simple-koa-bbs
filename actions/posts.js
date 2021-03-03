const { ValidationError } = require('sequelize')
const db = require('../models')
const Post = db.post

async function renderTop(ctx, post = {}, error = null) {
  const query = ctx.request.query
  const title = query.title
  const posts = await Post.latest(title ? { title } : {})
  await ctx.render('top', {
    error: error,
    test: new Date(),
    posts: posts,
    post: post,
  })
}

const index = async ctx => {
  return await renderTop(ctx)
}

const create = async ctx => {
  const post = { userId: ctx.state.currentUser.id, ...ctx.request.body }
  const entity = Post.build(post)
  try {
    await entity.save()
    ctx.redirect('/')
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e)
      return renderTop(ctx, entity, e)
    }

    throw e
  }
}

module.exports = { index, create }

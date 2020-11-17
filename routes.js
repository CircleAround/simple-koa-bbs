
const { ValidationError, DataTypes } = require('sequelize')
const db = require('./models')
const Post = db.post

module.exports = function routes(router) {
  async function renderTop(ctx, post, error = null) {
    const posts = await Post.newest()  
    await ctx.render('top', {
      error: error,
      test: new Date(),
      posts: posts,
      post: post
    })
  }  
  
  const top = async ctx => {
    return renderTop(ctx, Post.build())
  }
  
  const create = async ctx => {
    const post = ctx.request.body
    const entity = Post.build(post)
    try {
      await entity.save()
      ctx.redirect('/')
    } catch (e) {
      if(e instanceof ValidationError) {
        console.log(e)
        return renderTop(ctx, entity, e)
      }
  
      throw e
    }
  }

  router
    .get('/', top)
    .post('/post', create)
}

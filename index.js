const path = require('path')
const views = require('koa-views')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')

const { ValidationError, DataTypes } = require('sequelize')
const db = require('./models')
const Post = require('./models/post')(db.sequelize, DataTypes)

const Koa = require('koa')
const app = new Koa()

app
  .use(logger())
  .use(bodyParser())
  .use(views(path.join(__dirname, '/views'), { extension: 'ejs' }))
  .use(router.routes())
  .use(router.allowedMethods())

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

app.listen(3000)
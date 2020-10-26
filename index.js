const path = require('path')
const views = require('koa-views')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')

const { DataTypes } = require('sequelize')
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

const top = async ctx => {
  const posts = await Post.findAll()

  await ctx.render('top', {
    test: new Date(),
    posts: posts
  })
}

const create = async ctx => {
  const post = ctx.request.body
  const entity = Post.build(post)
  await entity.save()

  ctx.redirect('/')
}

router
  .get('/', top)
  .post('/post', create)

app.listen(3000)
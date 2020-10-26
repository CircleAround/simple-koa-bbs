const path = require('path')
const views = require('koa-views')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')

const Koa = require('koa')
const app = new Koa()
app
  .use(logger())
  .use(bodyParser())
  .use(views(path.join(__dirname, '/views'), { extension: 'ejs' }))
  .use(router.routes())
  .use(router.allowedMethods())

const posts = []

const top = async ctx => {
  await ctx.render('top', {
    test: new Date(),
    posts: posts
  })
}

const create = async ctx => {
  const post = ctx.request.body
  post.created_at = new Date()
  posts.push(post)
  ctx.redirect('/')
}

router
  .get('/', top)
  .post('/post', create)

app.listen(3000)
const path = require('path')
const views = require('koa-views')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const flash = require('koa-flash')

const result = require('dotenv').config()
if (result.error) {
  throw result.error
}

const Koa = require('koa')
const app = new Koa()
const routes = require('./routes')

app.keys = [process.env['SESSION_KEY']]

app
  .use(session({
    key: 'simple.bbs.session', 
    prefix: 'simplebbs:sessions:',
    store: redisStore()
  }))
  .use(flash())
  .use((ctx, next) => { 
    ctx.state.flash = ctx.flash || {}
    return next()
  })
  .use(logger())
  .use(bodyParser())
  .use(views(path.join(__dirname, '/views'), { extension: 'ejs' }))
  .use(router.routes())
  .use(router.allowedMethods())

routes(router)

app.listen(3000)


/*
・このアプリケーションの作りに依存している？もう少し汎用的ではないか？
・変更される理由やタイミング、頻度について考える。責務。安定不安定。
・一緒に変更されそうなものが一緒になっている
*/
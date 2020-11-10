const path = require('path')
const views = require('koa-views')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const convert = require('koa-convert')
const flash = require('koa-flash')
const override = require('koa-override')

const result = require('dotenv').config()
if (result.error) {
  throw result.error
}

const Koa = require('koa')
const app = new Koa()
const routes = require('./routes')

app.keys = [process.env['SESSION_KEY']]

// for legacy type middleware
const _use = app.use
app.use = x => _use.call(app, convert(x))

const csrfToken = async (ctx, next) => { 
  const key = '_token'
   
  // データが全く無いとIDが毎回変わるのでログインに失敗する為
  ctx.session.accessedAt = new Date()

  ctx.state.csrfToken = ctx.sessionId
  ctx.state.csrfTag = () => `<input type="hidden" name="${key}" value="${ctx.sessionId}" />`

  if(['POST', 'PUT', 'DELETE'].includes(ctx.method)) { 
    if(ctx.request.body[key] != ctx.sessionId) {
      ctx.throw(403, 'CSRF Token mismatch')
      return
    }
  }
  await next()
}

app
  .use(logger())
  .use(require('koa-static')(path.join(__dirname, 'public')))
  .use(session({
    key: 'simple.bbs.session', 
    prefix: 'simplebbs:sessions:',
    store: redisStore()
  }))
  .use(flash())
  .use(async (ctx, next) => { 
    ctx.state.flash = ctx.flash || {}
    await next()
  })
  .use(bodyParser())
  .use(override())  
  .use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))
  .use(csrfToken)
  .use(router.routes())
  .use(router.allowedMethods())

// @see https://github.com/koajs/koa/wiki/Error-Handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error(err.message)
    console.trace()
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('fatal error', err, ctx)
  }
})

app.on('error', (err, ctx) => {
  // TODO: あとで実装する
  console.error(err.message)
  console.trace()
})

routes(router)

app.listen(3000)


/*
・このアプリケーションの作りに依存している？もう少し汎用的ではないか？
・変更される理由やタイミング、頻度について考える。責務。安定不安定。
・一緒に変更されそうなものが一緒になっている
*/
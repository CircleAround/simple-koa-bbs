const path = require('path')
const views = require('koa-ejs')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const convert = require('koa-convert')
const flash = require('koa-flash')
const override = require('koa-override')

const fs = require('fs')
if(fs.existsSync('./env')) {
  const result = require('dotenv').config()
  if (result.error) {
    throw result.error
  }  
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

views(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  layout: false,
  cache: false,
  // debug: true,
  async: true
})

app
  .use(logger())
  .use(require('koa-static')(path.join(__dirname, 'public')))
  .use(session({
    key: 'simple.bbs.session', 
    prefix: 'simplebbs:sessions:',
    store: redisStore(process.env.REDIS_URL ? {url: process.env.REDIS_URL} : {})
  }))
  .use(flash())
  .use(async (ctx, next) => { 
    ctx.state.flash = ctx.flash || {}
    await next()
  })
  .use(bodyParser())
  .use(override())  
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

app.listen(process.env.PORT || 3000)

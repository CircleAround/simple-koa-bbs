const path = require('path')
const express = require('express')
const views = require('koa-ejs')
const logger = require('koa-logger')
const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const convert = require('koa-convert')
const flash = require('koa-flash')
const override = require('koa-override')
const csrfToken = require('./lib/middlewares/csrf-token')

const Koa = require('koa')
const app = new Koa()
const initializer = require('./config/initializer')
const routes = require('./config/routes')
const expressRoutes = require('./config/expressRoutes')

const boot = require('./boot')
boot()

const sessionKey = process.env.SESSION_KEY
if (!sessionKey) { throw new Error('process.env.SESSION_KEY not found') }
app.keys = [sessionKey]

// for legacy type middleware
const _use = app.use
app.use = x => _use.call(app, convert(x))

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
    store: process.env.REDIS_URL ? redisStore({ url: process.env.REDIS_URL }) : redisStore()
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
    console.error(err.stack)
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('fatal error', err, ctx)
  }
})

app.on('error', (err, ctx) => {
  // TODO: あとで実装する
  console.error(err.message)
  console.error(err.stack)
})

routes(router)

const listen = async (app, port, callback) => {
  initializer().then(async () => {
    const expressApp = express()
    await expressRoutes(expressApp, port)
    expressApp.use(app.callback())
    
    expressApp.listen(port, callback)
  }, (err) => {
    console.error('initialize failed')
    console.error(err.message)
    console.error(err.stack)
  })
}

const port = process.env.PORT || 3000
listen(app, port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
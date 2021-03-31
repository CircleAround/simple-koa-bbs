const path = require('path')
const views = require('koa-ejs')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const flash = require('koa-flash')
const override = require('koa-override')
const csrfToken = require('../lib/middlewares/csrf-token')

module.exports = async (app) => {
  const sessionKey = process.env.SESSION_KEY
  if (!sessionKey) { throw new Error('process.env.SESSION_KEY not found') }
  app.keys = [sessionKey]

  views(app, {
    root: path.join(__dirname, '../views'),
    viewExt: 'ejs',
    layout: false,
    cache: false,
    // debug: true,
    async: true
  })

  const sessionOptions = {
    key: 'simple.bbs.session',
    prefix: 'simplebbs:sessions:'
  }
  if(process.env.NODE_ENV === 'test') {
    app.use(session(sessionOptions))
  } else {
    const redisStore = require('koa-redis')
    app.use(session({
      ...sessionOptions,
      store: process.env.REDIS_URL ? redisStore({ url: process.env.REDIS_URL }) : redisStore()
    }))
  }

  app
    .use(logger())
    .use(require('koa-static')(path.join(__dirname, '../public')))
    .use(flash())
    .use(async (ctx, next) => {
      ctx.state.flash = ctx.flash || {}
      await next()
    })
    .use(bodyParser())
    .use(override())
    .use(csrfToken)
}
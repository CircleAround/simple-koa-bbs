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
const mail = require('./lib/mail')

const fs = require('fs')
if (fs.existsSync('./.env')) {
  const result = require('dotenv').config()
  if (result.error) {
    throw result.error
  }
}

const Koa = require('koa')
const app = new Koa()
const routes = require('./routes')

const sessionKey = process.env.SESSION_KEY
if (!sessionKey) { throw new Error('process.env.SESSION_KEY not found') }
app.keys = [sessionKey]

// for legacy type middleware
const _use = app.use
app.use = x => _use.call(app, convert(x))

const csrfToken = async (ctx, next) => {
  const key = '_token'

  // データが全く無いとIDが毎回変わるのでログインに失敗する為
  ctx.session.accessedAt = new Date()

  ctx.state.csrfToken = ctx.sessionId
  ctx.state.csrfTag = () => `<input type="hidden" name="${key}" value="${ctx.sessionId}" />`

  if (['POST', 'PUT', 'DELETE'].includes(ctx.method)) {
    if (ctx.request.body[key] != ctx.sessionId) {
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


const boot = (app) => {
  const port = process.env.PORT || 3000
  
  let mailConfig
  if(process.env.NODE_ENV === 'production') {
    mailConfig = {}
  } else {
    mailConfig = {
      debug: true,
      port: 1025,
      ignoreTLS: true
    }
  }

  mail.initMail(mailConfig).then(() => {
    app.listen(port, () => {
      console.log(`app listening at http://localhost:${port}`)
    })
  }, (err) => {
    console.error('initMail failed')
    console.error(err.message)
    console.error(err.stack)
  })
}

if (process.env.NODE_ENV == 'production') {
  boot(app)
} else {
  const express = require('express')
  const path = '/letter_opener'

  // https://github.com/maildev/maildev/blob/master/docs/api.md#use-maildev-as-a-middleware
  const { createProxyMiddleware } = require('http-proxy-middleware')
  const MailDev = require('maildev')
  const maildev = new MailDev({
    basePathname: path
  })
  maildev.listen(function (err) {
    if(err) { 
      console.error('maildev listen failed')
      console.error(err.message)
      console.error(err.stack)
    }
    console.log('We can now sent emails to port 1025!')
  })
  const proxy = createProxyMiddleware(path, {
    target: `http://localhost:1080`,
    ws: true,
  })

  const expressApp = express()
  expressApp.use(proxy)
  expressApp.use(app.callback())
  boot(expressApp)
}

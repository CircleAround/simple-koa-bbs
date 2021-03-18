const boot = require('./config/boot')
boot()

const express = require('express')
const router = require('@koa/router')()
const convert = require('koa-convert')

const Koa = require('koa')
const app = new Koa()

const initializer = require('./config/initializer')
const routes = require('./config/routes')
const expressRoutes = require('./config/expressRoutes')
const middlewares = require('./config/middlewares')

const startup = async () => {
  // for legacy type middleware
  const _use = app.use
  app.use = x => _use.call(app, convert(x))

  await middlewares(app)

  app
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

  await routes(router)
}

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
startup().then(() => {
  listen(app, port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })
})

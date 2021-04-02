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

// TODO: 後でカスタム可能にする
process.on('uncaughtException', function (err) {
  console.error(err)
  console.error(err.stack)
})

const startup = async () => {
  // for legacy type middleware
  const _use = app.use
  app.use = x => _use.call(app, convert(x))

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

  await middlewares(app)

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.on('error', (err, ctx) => {
    // TODO: あとで実装する
    console.error(err.message)
    console.error(err.stack)
  })

  await routes(router)
}

module.exports = async (options = {}) => {
  try {
    await initializer(options)

    const expressApp = express()
    await startup()
    await expressRoutes(expressApp)
    expressApp.use(app.callback())
  
    return expressApp
  } catch (err) {
    console.error('initialize error')
    console.error(err.stack)
    throw err
  }
}
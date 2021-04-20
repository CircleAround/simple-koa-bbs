const path = require('path')
const views = require('koa-ejs')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const flash = require('koa-flash')
const override = require('koa-override')
const { csrfToken } = require('../lib/middlewares/csrf-token')

function useSession(app) {
  const session = require('koa-generic-session')

  const sessionKey = process.env.SESSION_KEY
  if (!sessionKey) { throw new Error('process.env.SESSION_KEY not found') }
  app.keys = [sessionKey]

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
}

function useLocale(app) {
  const locale = require("koa-locale")
  const i18n = require("koa-i18n")

  locale(app)

  app.use(i18n(app, {
    directory: path.join(__dirname, "locales"),
    extension: ".json",
    locales: ["ja", "en"], //  `ja` defualtLocale, must match the locales to the filenames
    modes: [
      "query", //  optional detect querystring - `/?locale=en`
      "subdomain", //  optional detect subdomain   - `zh-CN.koajs.com`
      "cookie", //  optional detect cookie      - `Cookie: locale=zh-TW`
      "header", //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
      "url", //  optional detect url         - `/en`
      "tld" //  optional detect tld(the last domain) - `koajs.       //  optional custom function (will be bound to the koa context)
    ]
  }))
}

module.exports = async (app) => {
  views(app, {
    root: path.join(__dirname, '../views'),
    viewExt: 'ejs',
    layout: false,
    cache: false,
    // debug: true,
    async: true
  })

  useSession(app)
  useLocale(app)

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
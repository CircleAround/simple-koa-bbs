let fixedToken;

const dummyTokenName = '__dummyToken'

// for spec
const fixToken = (value  = dummyTokenName) => {
  fixedToken = value
}

// for spec
const clearFixedToken = () => {
  fixedToken = null
}

const csrfToken = async (ctx, next) => {
  const key = '_token'

  const token = fixedToken || ctx.sessionId

  if (['POST', 'PUT', 'DELETE'].includes(ctx.method)) {
    
    const requestedToken = ctx.request.body[key] || 
      ctx.get('csrf-token') ||
      ctx.get('xsrf-token') ||
      ctx.get('x-csrf-token') ||
      ctx.get('x-xsrf-token')

    if (requestedToken != token) {
      ctx.throw(403, 'CSRF Token mismatch')
      return
    }
  }

  // データが全く無いとIDが毎回変わるのでログインに失敗する為
  ctx.session.accessedAt = new Date()
  ctx.state.csrfToken = token
  ctx.state.csrfTag = () => `<input type="hidden" name="${key}" value="${token}" />`

  await next()
}

module.exports = { csrfToken, fixToken, clearFixedToken, dummyTokenName }
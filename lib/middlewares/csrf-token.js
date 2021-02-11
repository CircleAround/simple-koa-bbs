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

module.exports = csrfToken
const posts = require('./actions/posts')
const accounts = require('./actions/auth/accounts')
const sessions = require('./actions/auth/sessions')

module.exports = function routes(router) {
  router
    .get('/signup', accounts.index)
    .post('/accounts', accounts.create)
    .get('/login', sessions.index)
    .post('/sessions', sessions.create)

  router
    .get('/', posts.index)
    .post('/post', posts.create)
}

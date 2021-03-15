const posts = require('../actions/posts')
const accounts = require('../actions/auth/accounts')
const sessions = require('../actions/auth/sessions')

module.exports = function routes(router) {
  router
    .use(sessions.currentUser)

  router
    .get('/signup', accounts.index)
    .post('/accounts', accounts.create)
    .get('/confirm', accounts.confirm)
    .get('/login', sessions.index)
    .get('/profile', sessions.show)
    .delete('/sessions', sessions.destroy)
    .post('/sessions', sessions.create)
    
  router
    .get('/', posts.index)
    .post('/post', posts.create)
}

const posts = require('../web/actions/posts')
const accounts = require('../web/actions/auth/accounts')
const sessions = require('../web/actions/auth/sessions')

module.exports = async (router) => {
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

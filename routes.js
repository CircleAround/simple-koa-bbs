const posts = require('./actions/posts')
const accounts = require('./actions/auth/accounts')
const sessions = require('./actions/auth/sessions')

module.exports = function routes(router) {
  router
<<<<<<< HEAD
    .use(sessions.currentUser)

  router
    .get('/signup', accounts.index)
    .post('/accounts', accounts.create)
    .get('/login', sessions.index)
    .get('/profile', sessions.show)
    .delete('/sessions', sessions.destroy)
    .post('/sessions', sessions.create)
    
=======
    .get('/signup', accounts.index)
    .post('/accounts', accounts.create)
    .get('/login', sessions.index)
    .post('/sessions', sessions.create)

>>>>>>> signup and login
  router
    .get('/', posts.index)
    .post('/post', posts.create)
}

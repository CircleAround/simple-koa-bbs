const posts = require('./controllers/posts_controller')
// const {session_create, session_index} = require('./controllers/sessions_controller')

module.exports = function routes(router) {
  router
    .get('/', posts.index)
    .post('/post', posts.create)
    // .post('/sessions', session_create)
    // .get('/login', session_index)
}

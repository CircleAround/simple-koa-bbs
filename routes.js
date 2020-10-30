const posts = require('./actions/posts')

module.exports = function routes(router) {
  router
    .get('/', posts.index)
    .post('/post', posts.create)
}

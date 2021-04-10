const postFixtures = require('./post')
const models = require('../../app/models')
const FixtureHelper = require('../support/fixture_helper')

const helper = new FixtureHelper('user', (i) => {
  return { nickName: `nickName${i}`, email: `user${i}@example.com`, password: 'password' }
})

module.exports = {
  next: function () {
    return helper.next()
  },

  createWithPosts: async function (count = 6) {
    const user = await models.user.createBase(this.next())
    await postFixtures.bulkCreate(user, count)  
    return user
  }
}
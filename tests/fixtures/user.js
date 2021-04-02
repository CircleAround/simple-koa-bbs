const postFixtures = require('./post')
const models = require('../../app/models')

module.exports = {
  createWithPosts: async ({nickName, email, password }) => {
    const user = await models.user.createBase({
      nickName,
      email,
      password
    })
    await postFixtures.bulkCreate(user, 6)  
  }
}
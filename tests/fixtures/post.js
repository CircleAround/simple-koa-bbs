
const FixtureHelper = require('../support/fixture_helper')

const helper = new FixtureHelper('post', (i, { user })=>{
  return { userId: user.id, title: `テスト${i}`, body: `テスト本文${i}`}
})

module.exports = {
  bulkCreate: async (user, count = 6) => {
    helper.bulkCreate(count, { user })
  }
}
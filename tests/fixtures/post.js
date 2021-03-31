
const { createSequential } = require('../support/fixture_helper')

module.exports = {
  bulkCreate: async (user, count = 6) => {
    createSequential('post', (i)=>{
      return { userId: user.id, title: `テスト${i}`, body: `テスト本文${i}`}
    }, count)
  }
}
const refleshModels = require('../../tests/support/reflesh_models')
const userFixtures = require('../../tests/fixtures/user')
const models = require('../../app/models')

beforeAll(async done => {
  await refleshModels(['user', 'userConfirmation', 'post'])
  done()
})

afterAll(async done => {
  await models.sequelize.close()
  done()
})

describe('.register', () => {
  test('新しいuserと共にuserConfirmationが作られること', async () => {
    const count = await models.userConfirmation.count()
    const params = userFixtures.next()
    
    const newUser = await models.user.register(params)

    expect(newUser).not.toBeNull()
    expect(await models.userConfirmation.count()).toBe(count + 1)

    const newUserConfirmation = await models.userConfirmation.findOne({order: [['id', 'DESC']]})
    expect(newUserConfirmation.userId).toBe(newUser.id)
    expect(newUserConfirmation.token).not.toBeNull()
    expect(newUserConfirmation.confirmedAt).toBeNull()

    const user = await newUserConfirmation.getUser()
    expect(user.id).toBe(newUser.id)
  })
})

describe('#getPosts', () => {
  test('関連しているpostが取得できること', async () => {
    const user = await userFixtures.createWithPosts(3)
    const posts = await user.getPosts()

    expect(posts.length).toBe(3)
  })
})


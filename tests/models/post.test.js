const refleshModels = require('../support/reflesh_models')
const postFixtures = require('../support/fixtures/post')

let models
beforeAll(async done => {
  models = await refleshModels(['user', 'post'])

  const user = await models.user.createBase({
    nickName: 'testuser',
    email: 'test@example.com',
    password: 'password'
  })
  await postFixtures.bulkCreate(user, 6)

  done()
})

afterAll(async done => {
  await models.sequelize.close()
  done()
})

describe('#title', () => {
  test('タイトルの長さが取得できる事', async () => {
    const post = models.post.build({ title: 'サンプル', body: 'テスト本文' })
    expect(post.titleLength()).toBe(4)
  })
})

describe('.latest', () => {
  test('デフォルトで最新5件の結果が最新順で取得できること', async () => {
    const posts = await models.post.latest()
    expect(posts.length).toBe(5)

    expect(posts[0].id > posts[1].id).toBe(true)
    expect(posts[1].id > posts[2].id).toBe(true)
    expect(posts[2].id > posts[3].id).toBe(true)
  })

  test('取得件数を指定できること', async () => {
    const posts = await models.post.latest({}, 3)
    expect(posts.length).toBe(3)
  })

  test('条件で絞れること', async () => {
    const posts = await models.post.latest({ title: 'テスト3' })
    expect(posts.length).toBe(1)

    const post = posts[0]
    expect(post.title).toBe('テスト3')
  })
})


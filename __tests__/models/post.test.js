const refleshModels = require('../../tests/support/reflesh_models')
const userFixtures = require('../../tests/fixtures/user')
const models = require('../../app/models')

beforeAll(async done => {
  await refleshModels(['user', 'post'])
  await userFixtures.createWithPosts({
    nickName: 'testuser',
    email: 'test@example.com',
    password: 'password'
  })

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

    expect(posts[0].id).toBeGreaterThan(posts[1].id)
    expect(posts[1].id).toBeGreaterThan(posts[2].id)
    expect(posts[2].id).toBeGreaterThan(posts[3].id)
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


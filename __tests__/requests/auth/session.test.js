const web = require("../../../web.js")
const models = require('../../../app/models')
const userFixtures = require('../../../tests/fixtures/user')
const refleshModels = require('../../../tests/support/reflesh_models')
const { dispose } = require('../../../lib/platform')
const { fixToken, clearFixedToken } = require('../../../lib/middlewares/csrf-token')
const { login, agent } = require('../../../tests/support/request_helper')

let webApp

beforeAll(async (done) => {
  await refleshModels(['user', 'userConfirmation'])
  await userFixtures.create()

  webApp = await web()
  fixToken()
  done()
})

afterAll(async (done) => {
  clearFixedToken()
  await models.sequelize.close()
  await dispose()
  done()
})

describe('get /login', () => {
  it('アクセスできること', async () => {
    const res = await agent(webApp)
      .get('/login')
      .expect(200)

    expect(res.text).toContain('<h2>ログイン</h2>')
  })
})

describe('post /sessions', () => {
  it('ログインできること', async () => {
    const user = await models.user.findOne()

    const request = agent(webApp)
    {
      const res = await request
        .post('/sessions')
        .send({
          email: user.email,
          password: 'password'
        })
        .expect(302)
    
      expect(res.headers.location).toMatch('/')
    }

    {
      const res = await request.get('/').expect(200)
      expect(res.text).toContain('ログイン成功しました')
    }
  })
})

describe('delete /sessions', () => {
  let request

  beforeEach(async (done) => {
    request = agent(webApp)

    const user = await models.user.findOne()
    await login(request, user)
    done()
  })

  it('ログアウトできること', async () => {
    await request
      .delete('/sessions')
      .expect(302)
  })
})

describe('get /profile', () => { 
  describe('ログイン前の場合', () => {
    it('アクセスすると失敗すること', async () => {
      await agent(webApp)
        .get('/profile')
        .expect(401)
    })
  })

  describe('ログイン済みの場合', () => {
    let request
    let user
  
    beforeEach(async (done) => {
      request = agent(webApp)
  
      user = await models.user.findOne()
      await login(request, user)
      done()
    })
  
    test('ユーザ専用ページにアクセスできること', async () => {
      const res = await request
        .get('/profile')
        .expect(200)
  
      expect(res.text).toContain(user.email) // ページはユーザーのemailを含む
      expect(res.text).toContain(user.nickName) // ページはユーザーのnickNameを含む
    })
  })
})

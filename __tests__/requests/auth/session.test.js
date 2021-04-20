const web = require("../../../web.js")
const models = require('../../../app/models')
const userFixtures = require('../../../tests/fixtures/user')
const refleshModels = require('../../../tests/support/reflesh_models')
const { dispose } = require('../../../lib/platform')
const { fixToken } = require('../../../lib/middlewares/csrf-token')
const { login, agent } = require('../../../tests/support/request_helper')

fixToken('dummyToken')
 
let webApp
 
beforeAll(async (done) => {
  await refleshModels(['user', 'userConfirmation'])
  await userFixtures.create()

  webApp = await web()
  done()
})

afterAll(async (done) => {
  await models.sequelize.close()
  await dispose()
  done()
})

it('ログイン前にアクセスすると失敗すること', (done) => {
  agent(webApp).get('/profile')
    .expect(401)
    .end(done)
})

it('ログインできること', async (done) => {
  const user = await models.user.findOne()
  agent(webApp)
    .post('/sessions')
    .send({
      _token: 'dummyToken',
      email: user.email,
      password: 'password'
    })
    .expect(302)
    .end(done)
})

describe('ログイン済みの場合', () => {
  let _agent

  beforeEach(async (done)=>{
    _agent = agent(webApp)

    const user = await models.user.findOne()
    await login(_agent, user)
    done()
  })

  test('ユーザ専用ページにアクセスできること', (done) => {
    _agent
      .get('/profile')
      .expect(200)
      .end(done)
  })
})


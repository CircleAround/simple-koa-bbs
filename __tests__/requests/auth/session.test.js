const supertest = require('supertest')
const web = require("../../../web.js")
const models = require('../../../app/models')
const userFixtures = require('../../../tests/fixtures/user')
const refleshModels = require('../../../tests/support/reflesh_models')
const { dispose } = require('../../../lib/platform')
const { enabled } = require('../../../lib/middlewares/csrf-token')
const { login } = require('../../../tests/support/request_helper')

enabled(false) // disable csrf-token check
 
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
  supertest.agent(webApp).get('/profile')
    .expect(401)
    .end(done)
})

it('ログインできること', async (done) => {
  const user = await models.user.findOne()
  supertest.agent(webApp)
    .post('/sessions')
    .send({
      email: user.email,
      password: 'password'
    })
    .expect(302)
    .end(done)
})

describe('ログイン済みの場合', () => {
  let session

  beforeEach(async (done)=>{
    session = supertest.agent(webApp)

    const user = await models.user.findOne()
    await login(session, user)
    done()
  })

  test('ユーザ専用ページにアクセスできること', (done) => {
    session
      .get('/profile')
      .expect(200)
      .end(done)
  })
})


const request = require("supertest")
const startApp = require("../../web.js")
const models = require('../../app/models')
const worker = require('../../extensions/worker')
const mail = require('../../extensions/mail')
const userFixtures = require('../../tests/fixtures/user')
const refleshModels = require('../../tests/support/reflesh_models')

let app
beforeAll(async (done)=>{
  await refleshModels(['user', 'post'])

  app = await startApp()

  await userFixtures.createWithPosts({
    nickName: 'testuser',
    email: 'test@example.com',
    password: 'password'
  })
  
  done()
})

afterAll(async (done) => {
  // TODO: この辺りのdisposeを全部一度に呼べるようにする
  await models.sequelize.close()
  await worker.dispose()
  await mail.dispose()
  done()
})

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200)
        done()
      });
  });
});
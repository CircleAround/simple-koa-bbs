const request = require("supertest")
const web = require("../../web.js")
const models = require('../../app/models')
const userFixtures = require('../../tests/fixtures/user')
const refleshModels = require('../../tests/support/reflesh_models')
const { dispose } = require('../../lib/autoload')

let webApp
beforeAll(async (done)=>{
  await refleshModels(['user', 'post'])

  webApp = await web()

  await userFixtures.createWithPosts({
    nickName: 'testuser',
    email: 'test@example.com',
    password: 'password'
  })
  
  done()
})

afterAll(async (done) => {
  await models.sequelize.close()
  await dispose()
  done()
})

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(webApp)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200)
        done()
      });
  });
});
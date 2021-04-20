const request = require("supertest")
const web = require("../../web.js")
const models = require('../../app/models')
const userFixtures = require('../../tests/fixtures/user')
const refleshModels = require('../../tests/support/reflesh_models')
const { dispose } = require('../../lib/platform')

let webApp
beforeAll(async (done)=>{
  await refleshModels(['user', 'post'])

  webApp = await web()
  await userFixtures.createWithPosts()
  
  done()
})

afterAll(async (done) => {
  await models.sequelize.close()
  await dispose()
  done()
})

describe("/", () => {
  test("GETが成功すること", async done => {
    const response = await request(webApp).get("/")
    expect(response.statusCode).toBe(200)
    done()
  });
});
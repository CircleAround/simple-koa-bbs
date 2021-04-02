const request = require("supertest")
const startApp = require("../../app.js")
const models = require('../../app/models')
const worker = require('../../extensions/worker')
const mail = require('../../extensions/mail')

let app
beforeAll(async (done)=>{
  app = await startApp()
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
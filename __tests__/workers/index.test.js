const startApp = require("../../app.js")
const workers = require('../../app/workers')
const mailers = require('../../app/mailers')
const models = require('../../app/models')

let app
beforeAll(async (done) => {
  app = await startApp()
  done()
})

afterAll(async (done) => {
  await models.sequelize.close()
  done()
})

test('sendConfirmationMail', async () => {
  const user = await models.user.register({ 
    nickName: 'nickName', 
    email: 'email@example.com', 
    password: 'password'
  })

  await workers.sendConfirmationMail({userId: user.id})

  const logs = mailers.auth.getMailer().getSentLogs()
  expect(logs.length).toBe(1)

  const { params } = logs[0]
  expect(params.to).toBe('email@example.com')
  expect(params.subject).toBe('[SimpleBBS]ユーザー登録確認')
  expect(params.from).toBe('"SimpleBBS" <noreply@example.com>')
  expect(params.text).toMatch(/簡単な掲示板のアカウント作成が申請されました。/)
  expect(params.html).toMatch(/簡単な掲示板のアカウント作成が申請されました。/)
})
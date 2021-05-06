const web = require("../../web.js")
const workers = require('../../app/workers')
const mailers = require('../../app/mailers')
const models = require('../../app/models')
const refleshModels = require('../../tests/support/reflesh_models')
const { dispose } = require('../../lib/platform')

let webApp
beforeAll(async (done) => {
  webApp = await web()
  await refleshModels(['user', 'userConfirmation'])
  done()
})

afterAll(async (done) => {
  await models.sequelize.close()
  await dispose()
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
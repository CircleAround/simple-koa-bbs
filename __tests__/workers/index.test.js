const startApp = require("../../app.js")
const workers = require('../../app/workers')

let app
beforeAll(async (done) => {
  app = await startApp({ targets: ['worker.js', 'mail.js'] })
  done()
})

test('aaa', async () => {
  await workers.sendConfirmationMail({userId: 1})
  // メール関数がコールされたチェックをする
})
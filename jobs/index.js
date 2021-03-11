const job = require('../lib/job')
const mailers = require('../mailers')
const db = require('../models')
const User = db.user

job.queues().email.process(async (job)=>{
  const userId = job.data.userId
  const user = await User.findByPk(userId)
  if(!user) {  
    throw new Error(`User not found: id=${userId}`)
  }

  // TODO: confirmationの状態をチェックして送信不要なら送らない

  console.log('sendConfirmationMail')
  await mailers.auth.sendConfirmationMail(user)
})

const sendConfirmationMail = async function (user){
  job.queues().email.add({ userId: user.id })
}

module.exports = { sendConfirmationMail }
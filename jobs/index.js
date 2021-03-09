const job = require('../lib/job')
const authMailer = require('../mailers/auth')
const db = require('../models')
const User = db.user

exports.sendConfirmationMail = async function (userId){
  const user = await User.findByPk(userId)
  if(!user) {  
    throw new Error(`User not found: id=${userId}`)
  }

  // TODO: confirmationの状態をチェックして送信不要なら送らない

  job.queues().email.process(async (_job)=>{
    await authMailer.sendConfirmationMail(user)
  })
}
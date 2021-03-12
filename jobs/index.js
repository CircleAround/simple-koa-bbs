const job = require('../lib/job')
const mailers = require('../mailers')
const db = require('../models')
const User = db.user

job.queues().mailers.process(async (job)=>{
  const userId = job.data.params.userId
  const user = await User.findByPk(userId)
  if(!user) {  
    throw new Error(`User not found: id=${userId}`)
  }

  const type = 'mailers'
  const methodName = job.data.methodName
  const methods = methodName.split('.')
  let method = mailers
  methods.forEach((m) => {
    method = method[m]
    if(!method) {
      throw new Error(`method not found: ${type}.${methodName}`)
    }
  })

  console.log(`call ${type}.${methodName}`)
  await method(user)
})

const sendConfirmationMail = async function (user){
  job.enqueue('mailers', 'auth.sendConfirmationMail', { userId: user.id })
}

module.exports = { sendConfirmationMail }
module.exports = async function () {
  const options = {}
  const queueOptions = {
    mailers: {}
  }

  if(process.env.NODE_ENV === 'test') {
    return { mock: true, options, queueOptions }
  }

  if(process.env.NODE_ENV === 'production') {
    if(!process.env.REDIS_URL) {
      throw new Error('REDIS_URL required')
    }
  }

  if(process.env.REDIS_URL) {
    return {
      options: [process.env.REDIS_URL, options], // [REDIS_URL, options]
      queueOptions 
    } 
  }
  
  //return ['redis://localhost:6379', { queueOptions }]
  return { options, queueOptions }
}

async function config() {
  const queueOptions = {
    mailers: {}
  }

  if(process.env.NODE_ENV == 'production') {
    if(!process.env.REDIS_URL) {
      throw new Error('REDIS_URL required')
    }
  }

  if(process.env.REDIS_URL) {
    return [process.env.REDIS_URL, { queueOptions }] // [REDIS_URL, options]
  }
  
  //return ['redis://localhost:6379', { queueOptions }]
  return { queueOptions }
}

module.exports = config
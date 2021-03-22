async function config() {
  const queueOptions = {
    mailers: {}
  }

  if(process.env.NODE_ENV == 'production') {
    return [process.env.REDIS_URL, { queueOptions }] // [REDIS_URL, options]
  }
  
  //return ['redis://localhost:6379', { queueOptions }]
  return { queueOptions }
}

module.exports = config
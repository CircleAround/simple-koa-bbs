function config() {
  const queueOptions = {
    email: {}
  }

  if(process.env.NODE_ENV == 'production') {
    return [process.env.REDIS_URL, { queueOptions }] // [REDIS_URL, options]
  }
  return { queueOptions }
}

module.exports = config
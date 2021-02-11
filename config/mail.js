function config() {
  if(process.env.NODE_ENV === 'production') {
    return {}
  } else {
    // @see https://maildev.github.io/maildev/ Example Setups
    return {
      debug: true,
      port: 1025,
      ignoreTLS: true
    }
  }  
}

module.exports = config
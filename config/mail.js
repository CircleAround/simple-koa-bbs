function config() {
  if(process.env.NODE_ENV === 'production') {
    return {
      host: 'smtp.sendgrid.net',
      port: 587,
      requiresAuth: true,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_APIKEY
      }      
    }
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
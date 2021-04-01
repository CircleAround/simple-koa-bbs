const fetch = require('node-fetch')

let _config

async function config() {
  if(_config) { return _config }

  // for personal demo
  // @see https://devcenter.heroku.com/articles/mailtrap
  if(process.env.MAILTRAP_API_TOKEN) {
    const res = await fetch(`https://mailtrap.io/api/v1/inboxes.json?api_token=${process.env.MAILTRAP_API_TOKEN}`)
    const json = await res.json()
    const inbox = json[0]

    return _config = {
      host: inbox.domain,
      port: 587,
      auth: {
        user: inbox.username,
        pass: inbox.password
      }      
    }
  }

  if(process.env.NODE_ENV === 'production') {
    return _config = {
      host: 'smtp.sendgrid.net',
      port: 587,
      requiresAuth: true,
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }      
    }
  } 

  if(process.env.NODE_ENV === 'test') {
    return _config = { mock: true }
  }

  // @see https://maildev.github.io/maildev/ Example Setups
  return _config = {
    host: process.env.SMTP_HOST || 'localhost',
    debug: true,
    port: 1025,
    ignoreTLS: true
  }
}

module.exports = config
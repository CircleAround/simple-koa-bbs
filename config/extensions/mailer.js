function config() {
  return {
    from: '"SimpleBBS" <noreply@example.com>',
    host: process.env.MAILER_URL_HOST
  }
}

module.exports = config
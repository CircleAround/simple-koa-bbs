function config() {
  return {
    from: '"SimpleBBS" <noreply@example.com>',
    host: process.env.MAIL_HOST
  }
}

module.exports = config
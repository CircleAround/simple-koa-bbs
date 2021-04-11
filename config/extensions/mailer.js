module.exports = function () {
  return {
    from: '"SimpleBBS" <noreply@example.com>',
    host: process.env.MAILER_URL_HOST
  }
}

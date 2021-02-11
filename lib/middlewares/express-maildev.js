function mailDev({ path, port = 1025, web_port = 1080 }) {
  // @see https://github.com/maildev/maildev/blob/master/docs/api.md#use-maildev-as-a-middleware
  const { createProxyMiddleware } = require('http-proxy-middleware')
  const MailDev = require('maildev')
  const maildev = new MailDev({
    basePathname: path,
    smtp: port,
    web: web_port
  })

  maildev.listen(function (err) {
    if(err) { 
      console.error('maildev listen failed')
      console.error(err.message)
      console.error(err.stack)
    }
    console.log(`We can now sent emails to port ${port}!`)
  })
  
  return createProxyMiddleware(path, {
    target: `http://localhost:${web_port}`,
    ws: true,
  })
}

module.exports = mailDev
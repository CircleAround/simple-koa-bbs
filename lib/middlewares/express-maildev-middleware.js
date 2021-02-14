async function mailDev({ path, port: smtp = 1025, web = 1080 }) {
  // @see https://github.com/maildev/maildev/blob/master/docs/api.md#use-maildev-as-a-middleware
  const { createProxyMiddleware } = require('http-proxy-middleware')
  const MailDev = require('maildev')
  const maildev = new MailDev({
    basePathname: path,
    smtp: smtp,
    web: web
  })

  return new Promise((resolve, reject)=>{
    maildev.listen(function (err) {
      if(err) { 
        console.error('maildev listen failed')
        console.error(err.message)
        console.error(err.stack)
        reject(err)
        return
      }

      const target = `http://localhost:${web}`
      console.log(`MailDev listen start on port ${smtp}`)
      
      const proxy = createProxyMiddleware(path, {
        target: target,
        ws: true,
        logLevel: 'error',
      })
      console.log(`MailDev Web Admin at : ${target}${path}`)
      resolve(proxy)
    })
  })
}

module.exports = mailDev
const web = require('./web.js')

const port = process.env.PORT || 3000

const serv = async () => {
  try {
    const app = await web()
    app.listen(port, () => {
      console.log(`app listening at http://localhost:${port}`)
    })  
  } catch (err) {
    console.error('initialize failed')
    console.error(err.message)
    console.error(err.stack)
  }
}

serv()

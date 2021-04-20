const supertest = require('supertest')

async function login(agent, user) {
  return new Promise((resolve, reject)=>{
    agent
      .post('/sessions')
      .send({
        email: user.email,
        password: 'password'
      })
      .expect(302)
      .end((err, ret)=>{
        if(err) { reject(err) }
        else { resolve(ret) }
      })
  })
}

function agent(webApp, { csrfToken } = { csrfToken: 'dummyToken' }) {
  return supertest.agent(webApp)
    .set('x-csrf-token', csrfToken)
}

module.exports = { login, agent }
const supertest = require('supertest')
const { dummyTokenName } = require('../../lib/middlewares/csrf-token')

async function login(agent, user) {
  if (!agent) { throw new Error('agent required') }
  if (!user) { throw new Error('user required') }

  return await agent
    .post('/sessions')
    .send({
      email: user.email,
      password: 'password'
    })
    .expect(302)
}

function agent(webApp, { csrfToken } = { csrfToken: dummyTokenName }) {
  return supertest.agent(webApp)
    .set('x-csrf-token', csrfToken)
}

module.exports = { login, agent }
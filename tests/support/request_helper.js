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

module.exports = { login }
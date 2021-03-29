const rewire = require('rewire')

const extension = require('../../extensions/worker')
const app = { 
  dummy: { 
    testFunction: jest.fn(()=> {})
  }
}
extension.moduleOf = (type) => { return app[type] }

let models
beforeAll(async done => {
  models = require('../../app/models')
  done()
})

afterAll(async done => {
  await models.sequelize.close()
  done()
})

test('test', () => {
  // const extension = rewire('../../extensions/worker')
  // console.log(extension.__get__('initAutoProcess'))

  expect(1).toEqual(1)
})
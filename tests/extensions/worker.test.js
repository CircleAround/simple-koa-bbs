const extension = require('../../extensions/worker')

const app = { 
  dummy: { 
    testFunction: jest.fn(()=> {})
  }
}
extension.moduleOf = (moduleName) => { return app[moduleName] }

const validSingleParameterJob = {
  data: {
    methodName: 'testFunction',
    params: { param1: 'param1Value' }
  }
}

test('shoulde call singleParameterFunction', () => {
  const handler = extension.getAutoProcessHandler('dummy')

  handler(validSingleParameterJob)

  expect(app.dummy.testFunction.mock.calls.length).toBe(1)
  expect(app.dummy.testFunction.mock.calls).toContainEqual([{"param1": "param1Value"}])
})

test('shoulde throw exception when module not found', async () => {
  const handler = extension.getAutoProcessHandler('unknown')

  expect.assertions(2)
  try {
    await handler(validSingleParameterJob)
  } catch(e) {
    expect(e).toBeInstanceOf(Error)
    expect(e.message).toMatch('Module not found: unknown')
  }
})

test('shoulde throw exception when function not found', async () => {
  const handler = extension.getAutoProcessHandler('dummy')

  expect.assertions(2)
  try {
    await handler({ 
      data: {
        methodName: 'unknownFunction',
        params: { param1: 'param1Value' }
      }    
    })
  } catch(e) {
    expect(e).toBeInstanceOf(Error)
    expect(e.message).toMatch('Method not found: dummy.unknownFunction')
  }
})
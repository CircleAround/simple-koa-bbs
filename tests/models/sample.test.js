function divide(lhv, rhv) {
  // if(rhv == 0) { throw new Error('0では割れません') }
  return lhv / rhv
}

test('割り算されること', () => {
  expect(divide(10, 2)).toBe(5)
})

test('0で割ると無限大になること', () => {
  expect(divide(10, 0)).toBe(Infinity)
})

// test('0で割ると例外になること', () => {
//   expect( ()=> divide(10, 0) ).toThrow('0では割れません')
// })

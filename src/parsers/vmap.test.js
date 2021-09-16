describe('VMAPManager', () => {
  describe('request method', () => {
    test.todo('returns a promise')
    test.todo('throws one error if receives a invalid URL')
    test.todo('returns the VMAP XML in plain text after the returned promise is resolved')
    test.todo('returns one error after the returned promise is rejected')
  })

  describe('process method', () => {
    test.todo('returns a promise')
    test.todo('transforms incoming XML VMAP plain text to JSON format after the returned promise is resolved')
  })

  describe('filterRawData method', () => {
    test.todo('returns an promise array')
    test.todo('returns one array with AdBreaks after all returned promises are resolved')
    test.todo('supports IAB VMAP format')
    test.todo('supports Custom VMAP format')
  })

  describe('createAdBreak method', () => {
    test.todo('returns one AdBreak instance')
    test.todo('formats the timeOffset of received adBreakConfig before create one AdBreak instance')
  })
})

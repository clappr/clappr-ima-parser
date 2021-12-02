describe('VMAPManager', () => {
  describe('request method', () => {
    test.todo('returns a promise')
    test.todo('throws one error if receives a invalid URL')
    test.todo('transforms incoming XML VMAP plain text to JSON format after the returned promise is resolved')
    test.todo('returns one error after the returned promise is rejected')
  })

  describe('filterRawData method', () => {
    test.todo('returns one array with AdBreaks')
    test.todo('supports IAB VMAP format')
    test.todo('supports Custom VMAP format')
    test.todo('returns a rejected promise for IAB VMAP format decode errors')
    test.todo('returns a rejected promise for Custom VMAP format decode errors')
  })

  describe('createAdBreak method', () => {
    test.todo('returns one AdBreak instance')
    test.todo('formats the timeOffset of received adBreakConfig before create one AdBreak instance')
  })
})

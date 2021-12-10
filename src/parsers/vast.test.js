import VASTManager from './vast'
import { VASTClient } from 'vast-client'

describe('VASTManager', () => {
  test('creates one VASTClient instance when is built', () => {
    const VASTHandler = new VASTManager()

    expect(VASTHandler.client instanceof VASTClient).toBeTruthy()
  })

  describe('request method', () => {
    test('returns one error for no adData received', done => {
      const VASTHandler = new VASTManager()

      VASTHandler.request()
        .catch(error => {
          expect(error).toEqual('Invalid adTag received to request VAST')
          done()
        })
    })

    test('returns one error for invalid adData received', done => {
      const VASTHandler = new VASTManager()

      VASTHandler.request({})
        .catch(error => {
          expect(error).toEqual('Invalid ads')
          done()
        })
    })

    test('returns a promise for a valid received adData', () => {
      const VASTHandler = new VASTManager()

      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementation(() => new Promise(resolve => resolve()))

      let response = VASTHandler.request({ '#cdata': 'https://ad-server.com/test?vad_type=linear' })

      expect(response instanceof Promise).toBeTruthy()

      response = VASTHandler.request([{ '#cdata': 'https://ad-server.com/test?vad_type=linear' }])

      expect(response instanceof Promise).toBeTruthy()
    })

    test('returns one error for invalid ads response', () => {
      const VASTHandler = new VASTManager()

      jest.spyOn(VASTHandler.client, 'get').mockImplementationOnce(() => new Promise(resolve => resolve({})))

      expect(VASTHandler.request({ '#cdata': 'https://ad-server.com/test?vad_type=linear' })).rejects.toThrow('Empty ads')
    })

    test('returns the ad content after the promise is resolved', () => {
      const VASTHandler = new VASTManager()
      const responseMock = { ads: [{ creatives: [{ mediaFiles: {} }] }] }

      jest.spyOn(VASTHandler.client, 'get').mockImplementationOnce(() => new Promise(resolve => resolve(responseMock)))

      expect(VASTHandler.request({ '#cdata': 'https://ad-server.com/test?vad_type=linear' })).resolves.toEqual(responseMock.ads[0])
    })
  })
})

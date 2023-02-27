import VASTManager from './vast'
import { VASTClient } from '@dailymotion/vast-client'

describe('VASTManager', () => {
  let VASTHandler
  const url = 'https://ad-server.com/test?vad_type=linear'
  const vastIdInfoFromUrl2 = [{id: '452369852', sequence: null, adType: null, adServingId: null, categories: 'A'}]

  beforeEach(() => {
    VASTHandler = new VASTManager()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('creates one VASTClient instance when is built', () => {
    expect(VASTHandler.client instanceof VASTClient).toBeTruthy()
  })

  describe('request method', () => {
    it('returns one error for no adData received', done => {
      VASTHandler.request()
        .catch(error => {
          expect(error).toEqual('Invalid adTag received to request VAST')
          done()
        })
    })

    it('returns a promise for a valid received adData', async () => {
      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementation(() => new Promise(resolve => resolve()))

      let response = VASTHandler.request({ '#cdata': url })

      await expect(response instanceof Promise).toBeTruthy()
    })

    it('return a array of promise with a valid receive adData', async () => {
      const vastIdInfoFromUrl1 = [{id: '1234568965', sequence: null, adType: null, adServingId: null, categories: 'A'}]

      const responseMock = [{id: '1234568965', sequence: null, adType: null, adServingId: null, categories: 'A'},
        {id: '452369852', sequence: null, adType: null, adServingId: null, categories: 'A'}]

      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(() => new Promise(resolve => resolve(vastIdInfoFromUrl1)))
      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(() => new Promise(resolve => resolve(vastIdInfoFromUrl2)))

      await expect(VASTHandler.request([{ '#cdata': url }, {'#cdata': url}])).resolves.toEqual(responseMock)
    })

    it('return a valid promise even if one of the adData items contains an error', async () =>{
      const vastIdInfoErrorFromUrl1 = new Error('Empty ads')

      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(() => new Promise(resolve => resolve(vastIdInfoErrorFromUrl1)))
      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(() => new Promise(resolve => resolve(vastIdInfoFromUrl2)))

      await expect(VASTHandler.request([{ '#cdata': url }, {'#cdata': url}])).resolves.toEqual(vastIdInfoFromUrl2)
    })

    it('returns an empty array if the ads is empty', async () => {
      jest.spyOn(VASTHandler.client, 'get').mockImplementationOnce(() => new Promise(resolve => resolve({})))

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual([])
    })

    it('returns the ad content after the promise is resolved', async () => {
      const responseMock = { ads: [{ creatives: [{ mediaFiles: {} }] }, { creatives: [{ mediaFiles: {} }] }] }

      jest.spyOn(VASTHandler.client, 'get').mockImplementationOnce(() => new Promise(resolve => resolve(responseMock)))

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual(responseMock.ads)
    })
  })
})

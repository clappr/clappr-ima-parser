import VASTManager from './vast'
import { VASTClient } from '@dailymotion/vast-client'

describe('VASTManager', () => {
  let VASTHandler
  const url = 'https://ad-server.com/test?vad_type=linear'
  const vastIdInfoFromUrl2 = [{ id: '452369852', sequence: null, adType: null, adServingId: null, categories: 'A' }]
  const adsWithMediaFiles = [{ creatives: [{ mediaFiles: {} }] }]

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

    it('returns a promise for a valid received adData', async() => {
      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementation(() => new Promise(resolve => resolve()))

      const response = VASTHandler.request({ '#cdata': url })

      await expect(response instanceof Promise).toBeTruthy()
    })

    it('return a array of promise with a valid receive adData', async() => {
      const vastIdInfoFromUrl1 = [{ id: '1234568965', sequence: null, adType: null, adServingId: null, categories: 'A' }]

      const responseMock = {
        ads: [
          { id: '1234568965', sequence: null, adType: null, adServingId: null, categories: 'A' },
          { id: '452369852', sequence: null, adType: null, adServingId: null, categories: 'A' },
        ],
        errors: [],
      }

      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(
        () => new Promise(resolve => resolve({ ads: vastIdInfoFromUrl1, errors: [] })),
      )
      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(
        () => new Promise(resolve => resolve({ ads: vastIdInfoFromUrl2, errors: [] })),
      )

      await expect(VASTHandler.request([{ '#cdata': url }, { '#cdata': url }])).resolves.toEqual(responseMock)
    })

    it('return a valid promise even if one of the adData items contains an error', async() => {
      const requestError = new Error('Request timed out')

      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(
        () => new Promise(resolve => resolve({ ads: [], errors: [requestError] })),
      )
      jest.spyOn(VASTHandler, '_requestVASTAdInformation').mockImplementationOnce(
        () => new Promise(resolve => resolve({ ads: vastIdInfoFromUrl2, errors: [] })),
      )

      await expect(VASTHandler.request([{ '#cdata': url }, { '#cdata': url }])).resolves.toEqual({
        ads: vastIdInfoFromUrl2,
        errors: [requestError],
      })
    })

    it('returns an empty array if the ads is empty', async() => {
      jest.spyOn(VASTHandler.client, 'get').mockImplementationOnce(() => new Promise(resolve => resolve({})))

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({ ads: [], errors: [] })
    })

    it('returns the ad content after the promise is resolved', async() => {
      const responseMock = { ads: [{ creatives: [{ mediaFiles: {} }] }, { creatives: [{ mediaFiles: {} }] }] }

      jest.spyOn(VASTHandler.client, 'get').mockImplementationOnce(() => new Promise(resolve => resolve(responseMock)))

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({ ads: responseMock.ads, errors: [] })
    })

    it('returns a request error when client.get times out', async() => {
      const timeoutError = new Error('Request timed out')
      jest.spyOn(VASTHandler.client, 'get').mockRejectedValueOnce(timeoutError)

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({ ads: [], errors: [timeoutError] })
    })

    it('returns a request error when client.get fails with an HTTP error', async() => {
      const httpError = new Error('HTTP 502')
      jest.spyOn(VASTHandler.client, 'get').mockRejectedValueOnce(httpError)

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({ ads: [], errors: [httpError] })
    })

    it('wraps a non-Error rejection from client.get into an Error', async() => {
      jest.spyOn(VASTHandler.client, 'get').mockRejectedValueOnce('network down')

      const result = await VASTHandler.request({ '#cdata': url })

      expect(result.ads).toEqual([])
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toBeInstanceOf(Error)
      expect(result.errors[0].message).toBe('network down')
    })

    it('returns no-fill when VAST is valid but has no ads', async() => {
      jest.spyOn(VASTHandler.client, 'get').mockResolvedValueOnce({ ads: [] })

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({ ads: [], errors: [] })
    })

    it('returns ads from the successful URL and the error from the failing URL', async() => {
      const httpError = new Error('HTTP 502')
      jest.spyOn(VASTHandler.client, 'get')
        .mockResolvedValueOnce({ ads: adsWithMediaFiles })
        .mockRejectedValueOnce(httpError)

      await expect(VASTHandler.request([{ '#cdata': url }, { '#cdata': url }])).resolves.toEqual({
        ads: adsWithMediaFiles,
        errors: [httpError],
      })
    })

    it('follows the wrapper chain when an ad has no mediaFiles', async() => {
      const wrapperAd = { creatives: [] }
      const inlineAd = { creatives: [{ mediaFiles: {} }] }
      jest.spyOn(VASTHandler.client, 'get').mockResolvedValueOnce({ ads: [wrapperAd] })
      jest.spyOn(VASTHandler.client, 'hasRemainingAds').mockReturnValue(true)
      jest.spyOn(VASTHandler.client, 'getNextAds').mockResolvedValueOnce({ ads: [inlineAd] })

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({ ads: [inlineAd], errors: [] })
    })

    it('keeps a valid ad when a wrapper in the same URL resolves empty', async() => {
      const wrapperAd = { creatives: [] }
      jest.spyOn(VASTHandler.client, 'get').mockResolvedValueOnce({ ads: [adsWithMediaFiles[0], wrapperAd] })
      jest.spyOn(VASTHandler.client, 'hasRemainingAds').mockReturnValue(true)
      jest.spyOn(VASTHandler.client, 'getNextAds').mockResolvedValueOnce({ ads: [] })

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({
        ads: adsWithMediaFiles,
        errors: [],
      })
    })

    it('keeps a later valid ad when an earlier wrapper in the same URL resolves empty', async() => {
      const wrapperAd = { creatives: [] }
      jest.spyOn(VASTHandler.client, 'get').mockResolvedValueOnce({ ads: [wrapperAd, adsWithMediaFiles[0]] })
      jest.spyOn(VASTHandler.client, 'hasRemainingAds').mockReturnValue(true)
      jest.spyOn(VASTHandler.client, 'getNextAds').mockResolvedValueOnce({ ads: [] })

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({
        ads: adsWithMediaFiles,
        errors: [],
      })
    })

    it('keeps collected ads and the error when a wrapper in the same URL fails', async() => {
      const wrapperAd = { creatives: [] }
      const networkError = new Error('HTTP 502')
      jest.spyOn(VASTHandler.client, 'get').mockResolvedValueOnce({ ads: [adsWithMediaFiles[0], wrapperAd] })
      jest.spyOn(VASTHandler.client, 'hasRemainingAds').mockReturnValue(true)
      jest.spyOn(VASTHandler.client, 'getNextAds').mockRejectedValueOnce(networkError)

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({
        ads: adsWithMediaFiles,
        errors: [networkError],
      })
    })

    it('returns the inline ad and the resolved wrapper ad from the same URL', async() => {
      const wrapperAd = { creatives: [] }
      const inlineFromWrapper = { creatives: [{ mediaFiles: {} }] }
      jest.spyOn(VASTHandler.client, 'get').mockResolvedValueOnce({ ads: [adsWithMediaFiles[0], wrapperAd] })
      jest.spyOn(VASTHandler.client, 'hasRemainingAds').mockReturnValue(true)
      jest.spyOn(VASTHandler.client, 'getNextAds').mockResolvedValueOnce({ ads: [inlineFromWrapper] })

      await expect(VASTHandler.request({ '#cdata': url })).resolves.toEqual({
        ads: [adsWithMediaFiles[0], inlineFromWrapper],
        errors: [],
      })
    })
  })
})

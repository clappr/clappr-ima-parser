/**
 * @jest-environment jsdom
 */

import { Log } from '@clappr/core'
import IMAParser from './ima-parser'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'
import { standardParsedVMAPMock } from './mocks/valid-vmap'

describe('IMAParser', () => {
  it('creates internal references of necessary parsers at constructor', () => {
    const imaParser = new IMAParser()

    expect(imaParser._VMAPHandler instanceof VMAPManager).toBeTruthy()
    expect(imaParser.VASTHandler instanceof VASTManager).toBeTruthy()
  })

  it('exposes IMAParser as the log name', () => {
    expect(new IMAParser().name).toBe('IMAParser')
  })

  describe('requestAdBreaks method', () => {
    it('returns a promise', () => {
      const imaParser = new IMAParser()
      jest.spyOn(imaParser._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve(standardParsedVMAPMock)))
      const result = imaParser.requestAdBreaks({ url: 'https://server.com/vmap' })

      expect(result instanceof Promise).toBeTruthy()
    })

    it('returns an AdBreaks list after the returned promise is resolved', done => {
      const imaParser = new IMAParser()
      jest.spyOn(imaParser._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve(standardParsedVMAPMock)))
      jest.spyOn(Log, 'info').mockImplementation(() => {})

      imaParser.requestAdBreaks({ url: 'https://server.com/vmap' })
        .then(result => {
          expect(Object.keys(result[0])).toEqual(['category', 'adTag', 'timeOffset'])
          expect(Log.info).toHaveBeenCalledWith('IMAParser', 'Available adBreaks: ', result)
          done()
        })
    })

    it('returns one error after the returned promise is rejected', done => {
      const imaParser = new IMAParser()
      jest.spyOn(imaParser._VMAPHandler, 'request').mockImplementationOnce(() => new Promise((_, reject) => reject('expected error')))
      jest.spyOn(Log, 'error').mockImplementation(() => {})
      imaParser.requestAdBreaks({ url: 'https://server.com/vmap' })
        .catch(error => {
          expect(error).toEqual('expected error')
          expect(Log.error).toHaveBeenCalledWith('IMAParser', 'Fail to request VMAP: ', error)
          done()
        })
    })
  })

  describe('requestAds method', () => {
    it('returns a promise', () => {
      const imaParser = new IMAParser()
      const adBreakMock = { category: 'preroll', timeOffset: 1000, adTag: {} }
      jest.spyOn(imaParser.VASTHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve()))
      const result = imaParser.requestAds(adBreakMock.adTag)

      expect(result instanceof Promise).toBeTruthy()
    })

    it('returns one error after the returned promise is rejected', done => {
      const imaParser = new IMAParser()
      imaParser.requestAds()
        .catch(error => {
          expect(error).toBeInstanceOf(Error)
          expect(error.message).toBe('Invalid adTag received to request VAST')
          done()
        })
    })

    it('resolves with ads and errors from VASTHandler', async() => {
      const imaParser = new IMAParser()
      const result = { ads: [{ id: '1' }], errors: [] }
      jest.spyOn(imaParser.VASTHandler, 'request').mockResolvedValueOnce(result)

      await expect(imaParser.requestAds({ '#cdata': 'https://ad-server.com/vast' })).resolves.toEqual(result)
    })
  })
})

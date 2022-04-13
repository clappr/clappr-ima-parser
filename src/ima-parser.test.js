/**
 * @jest-environment jsdom
 */

import IMAParser from './ima-parser'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'
import { standardParsedVMAPMock } from './mocks/valid-vmap'

describe('IMAParser', () => {
  test('creates internal references of necessary parsers at constructor', () => {
    const imaParser = new IMAParser()

    expect(imaParser._VMAPHandler instanceof VMAPManager).toBeTruthy()
    expect(imaParser._VASTHandler instanceof VASTManager).toBeTruthy()
  })

  describe('requestAdBreaks method', () => {
    test('returns a promise', () => {
      const imaParser = new IMAParser()
      jest.spyOn(imaParser._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve(standardParsedVMAPMock)))
      const result = imaParser.requestAdBreaks('https://server.com/vmap')

      expect(result instanceof Promise).toBeTruthy()
    })

    test('returns an AdBreaks list after the returned promise is resolved', done => {
      const imaParser = new IMAParser()
      jest.spyOn(imaParser._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve(standardParsedVMAPMock)))

      imaParser.requestAdBreaks('https://server.com/vmap')
        .then(result => {
          expect(Object.keys(result[0])).toEqual([ 'category', 'adTag', 'timeOffset' ])
          done()
        })
    })

    test('returns one error after the returned promise is rejected', done => {
      const imaParser = new IMAParser()
      jest.spyOn(imaParser._VMAPHandler, 'request').mockImplementationOnce(() => new Promise((_, reject) => reject('expected error')))
      imaParser.requestAdBreaks('https://server.com/vmap')
        .catch(error => {
          expect(error).toEqual('expected error')
          done()
        })
    })
  })

  describe('requestAds method', () => {
    test('returns a promise', () => {
      const imaParser = new IMAParser()
      const adBreakMock = { category: 'preroll', timeOffset: 1000, adTag: {} }
      jest.spyOn(imaParser._VASTHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve()))
      const result = imaParser.requestAds(adBreakMock.adTag)

      expect(result instanceof Promise).toBeTruthy()
    })

    test('returns one error after the returned promise is rejected', done => {
      const imaParser = new IMAParser()
      imaParser.requestAds()
        .catch(error => {
          expect(error).toEqual('Invalid adTag received to request VAST')
          done()
        })
    })
  })
})

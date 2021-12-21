/**
 * @jest-environment jsdom
 */

import { Core, Container, Playback, version } from '@clappr/core'
import IMAParserPlugin from './ima-parser'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'
import AdBreak from './entities/ad-break'
import { standardParsedVMAPMock } from './mocks/valid-vmap'

const setupTest = (options = {}) => {
  const core = new Core(options)
  const plugin = new IMAParserPlugin(core)
  core.addPlugin(plugin)

  const response = { core, plugin }
  response.container = new Container({ playerId: 1, playback: new Playback({}) })

  return response
}

describe('IMAParserPlugin', () => {
  test('is loaded on core plugins array', () => {
    const { core, plugin } = setupTest()
    expect(core.getPlugin(plugin.name).name).toEqual('ima_parser')
  })

  test('is compatible with the latest Clappr core version', () => {
    const { core, plugin } = setupTest()
    expect(core.getPlugin(plugin.name).supportedVersion).toEqual({ min: version })
  })

  test('creates internal references of necessary parsers at constructor', () => {
    const { plugin } = setupTest()

    expect(plugin._VMAPHandler instanceof VMAPManager).toBeTruthy()
    expect(plugin._VASTHandler instanceof VASTManager).toBeTruthy()
  })

  describe('requestAdBreaks method', () => {
    test('returns a promise', () => {
      const { plugin } = setupTest()
      jest.spyOn(plugin._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve(standardParsedVMAPMock)))
      const result = plugin.requestAdBreaks('https://server.com/vmap')

      expect(result instanceof Promise).toBeTruthy()
    })

    test('returns an AdBreaks list after the returned promise is resolved', done => {
      const { plugin } = setupTest()
      jest.spyOn(plugin._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve(standardParsedVMAPMock)))

      plugin.requestAdBreaks('https://server.com/vmap')
        .then(result => {
          expect(result[0] instanceof AdBreak).toBeTruthy()
          done()
        })
    })

    test('returns one error after the returned promise is rejected', done => {
      const { plugin } = setupTest()
      jest.spyOn(plugin._VMAPHandler, 'request').mockImplementationOnce(() => new Promise((_, reject) => reject('expected error')))
      plugin.requestAdBreaks('https://server.com/vmap')
        .catch(error => {
          expect(error).toEqual('expected error')
          done()
        })
    })
  })

  describe('requestAds method', () => {
    const adBreakConfigMock = { category: 'preroll', timeOffset: 1000, adTag: {} }

    test('returns a promise', () => {
      const { plugin } = setupTest()
      const adBreakMock = new AdBreak(adBreakConfigMock)
      jest.spyOn(plugin._VASTHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve()))
      const result = plugin.requestAds(adBreakMock)

      expect(result instanceof Promise).toBeTruthy()
    })

    test('returns one error after the returned promise is rejected', done => {
      const { plugin } = setupTest()
      plugin.requestAds({})
        .catch(error => {
          expect(error).toEqual('Invalid adTag received to request VAST')
          done()
        })
    })
  })
})

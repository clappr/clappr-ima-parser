/**
 * @jest-environment jsdom
 */

import { Core, Container, Playback, version } from '@clappr/core'
import IMAParserPlugin from './ima-parser'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'
import AdBreak from './entities/ad-break'

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
      jest.spyOn(plugin._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve()))
      const result = plugin.requestAdBreaks('https://server.com/vmap')

      expect(result instanceof Promise).toBeTruthy()
    })

    test('returns an AdBreaks list after the returned promise is resolved', done => {
      const { plugin } = setupTest()
      jest.spyOn(plugin._VMAPHandler, 'request').mockImplementationOnce(() => new Promise(resolve => resolve()))

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

    test('returns an Ads list after the returned promise is resolved', done => {
      const { plugin } = setupTest()
      const adBreakMock = new AdBreak(adBreakConfigMock)
      adBreakMock.adTag['#cdata'] = 'https://pubads.g.doubleclick.net/gampad/ads?slotname=/124319096/external/ad_rule_samples&sz=640x480&ciu_szs=300x250&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&url=http://localhost:8080/&unviewed_position_start=1&output=xml_vast3&impl=s&env=vp&gdfp_req=1&ad_rule=0&useragent=Mozilla/5.0+(Macintosh%3B+Intel+Mac+OS+X+10_15_7)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/96.0.4664.55+Safari/537.36,gzip(gfe)&vad_type=linear&vpos=preroll&pod=1&ppos=1&lip=true&min_ad_duration=0&max_ad_duration=30000&vrid=6256&cmsid=496&video_doc_id=short_onecue&kfa=0&tfcd=0'
      plugin.requestAds(adBreakMock)
        .then(result => {
          expect(result).toHaveLength(1)
          expect(result[0].errorURLTemplates).toBeDefined()
          expect(result[0].impressionURLTemplates).toBeDefined()
          expect(result[0].creatives).toBeDefined()
          expect(result[0].extensions).toBeDefined()
          done()
        })
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

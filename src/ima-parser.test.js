import { Core, Container, Playback, version } from '@clappr/core'
import IMAParserPlugin from './ima-parser'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'

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
    test.todo('returns a promise')
    test.todo('returns an AdBreaks list after the returned promise is resolved')
    test.todo('returns one error after the returned promise is rejected')
  })

  describe('requestAds method', () => {
    test.todo('returns a promise')
    test.todo('returns an Ads list after the returned promise is resolved')
    test.todo('returns one error after the returned promise is rejected')
  })
})

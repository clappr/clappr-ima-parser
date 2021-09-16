import AdBreak from './ad-break'

const adBreakConfigMock = { category: 'preroll', timeOffset: 1000, adTag: {} }

describe('AdBreak', () => {
  test('saves internal private reference of received config', () => {
    const adBreak = new AdBreak(adBreakConfigMock)
    expect(adBreak._config).toEqual(adBreakConfigMock)
  })

  test('ads getter returns _ads value', () => {
    const adBreak = new AdBreak({})
    expect(adBreak.ads).toEqual(adBreak._ads)
  })

  test('category getter returns _config.category value', () => {
    const adBreak = new AdBreak(adBreakConfigMock)
    expect(adBreak.category).toEqual(adBreak._config.category)
  })

  test('timeOffset getter returns _config.timeOffset value', () => {
    const adBreak = new AdBreak(adBreakConfigMock)
    expect(adBreak.timeOffset).toEqual(adBreak._config.timeOffset)
  })

  test('adTag getter returns _config.adTag value', () => {
    const adBreak = new AdBreak(adBreakConfigMock)
    expect(adBreak.adTag).toEqual(adBreak._config.adTag)
  })

  test('addAd method push the received ad into the _ads reference', () => {
    const adBreak = new AdBreak({})
    const fakeAd = { foo: 'bar' }

    expect(adBreak.ads).toEqual([])

    adBreak.addAd(fakeAd)

    expect(adBreak.ads.length).toEqual(1)
    expect(adBreak.ads[0]).toEqual(fakeAd)
  })

  test('hasAds method checks if are at least one ad into the _ads array', () => {
    const adBreak = new AdBreak({})
    const fakeAd = { foo: 'bar' }

    expect(adBreak.hasAds()).toBeFalsy()

    adBreak.addAd(fakeAd)

    expect(adBreak.hasAds()).toBeTruthy()
  })
})

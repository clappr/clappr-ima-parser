import AdBreak from './adbreak'

describe('AdBreak', () => {
  const url = 'https://ad-server.com/test?vad_type=linear'

  it('extracts the URL from a #cdata AdTagURI', () => {
    const adBreak = new AdBreak({ '#cdata': url })

    expect(adBreak.adDataUrls).toEqual([url])
  })

  it('extracts the URL from a #text AdTagURI when #cdata is absent', () => {
    const adBreak = new AdBreak({ '#text': url })

    expect(adBreak.adDataUrls).toEqual([url])
  })

  it('prefers #cdata over #text when both are present', () => {
    const adBreak = new AdBreak({ '#cdata': url, '#text': 'https://other.example/vast' })

    expect(adBreak.adDataUrls).toEqual([url])
  })

  it('discards an AdTagURI that has neither #cdata nor #text', () => {
    const adBreak = new AdBreak({ '@templateType': 'vast3' })

    expect(adBreak.adDataUrls).toEqual([])
  })

  it('keeps valid URLs and discards entries without #cdata or #text', () => {
    const adBreak = new AdBreak([{ '#text': url }, { '@templateType': 'vast3' }, { '#cdata': url }])

    expect(adBreak.adDataUrls).toEqual([url, url])
  })

  it('strips every whitespace sequence from the AdTagURI', () => {
    const adBreak = new AdBreak({ '#cdata': 'https://ad-server.com/\ntest\n?vad_type=linear' })

    expect(adBreak.adDataUrls).toEqual(['https://ad-server.com/test?vad_type=linear'])
  })
})

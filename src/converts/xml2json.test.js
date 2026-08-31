/**
 * @jest-environment jsdom
 */
import xml2json from './xml2json'

const parse = xmlString => new DOMParser().parseFromString(xmlString, 'text/xml')

describe('xml2json', () => {
  it('keeps apostrophes in text instead of replacing them with escaped quotes', () => {
    expect(xml2json(parse('<root>O\'Brien</root>'))).toBe('O\'Brien')
  })

  it('keeps apostrophes in a URL', () => {
    expect(xml2json(parse('<AdTagURI>https://ad.example/o\'brien</AdTagURI>'))).toBe('https://ad.example/o\'brien')
  })

  it('keeps apostrophes inside CDATA', () => {
    const result = xml2json(parse('<AdTagURI><![CDATA[https://ad.example/o\'brien]]></AdTagURI>'))

    expect(result['#cdata']).toBe('https://ad.example/o\'brien')
  })

  it('escapes double quotes in text', () => {
    expect(xml2json(parse('<root>say "hello"</root>'))).toBe('say \\"hello\\"')
  })
})

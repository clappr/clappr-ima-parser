import { hmsToMilliseconds } from './str-to-time'

describe('hmsToMilliseconds', () => {
  it('parses one duration string to milliseconds', () => {
    const result = hmsToMilliseconds('10:34:17')

    expect(result).toEqual(38057000)
  })

  it('returns null for non string value', () => {
    expect(hmsToMilliseconds({})).toBeNull()
  })

  it('returns null for a two-part offset', () => {
    expect(hmsToMilliseconds('00:00')).toBeNull()
  })

  it('returns null for a percentage offset', () => {
    expect(hmsToMilliseconds('50%')).toBeNull()
  })

  it('returns null for a non-numeric offset', () => {
    expect(hmsToMilliseconds('abc')).toBeNull()
  })

  it('returns null when a time part is not numeric', () => {
    expect(hmsToMilliseconds('00:00:xx')).toBeNull()
  })

  it('parses an offset with a millisecond fraction', () => {
    expect(hmsToMilliseconds('00:00:15.000')).toEqual(15000)
  })
})

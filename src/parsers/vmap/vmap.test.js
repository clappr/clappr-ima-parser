/**
 * @jest-environment jsdom
 */
import VMAPManager from './vmap'
import { customParsedVMAPMock, standardParsedVMAPMock } from '@/mocks/valid-vmap'
import { urlHandler } from '@dailymotion/vast-client'
import xml2json from '@/converts/xml2json'

jest.mock('@dailymotion/vast-client', () => ({ urlHandler: { get: jest.fn() } }))

jest.mock('@/converts/xml2json', () => jest.fn())

describe('VMAPManager', () => {
  describe('request method', () => {
    it('returns a promise', () => {
      const VMAPHandler = new VMAPManager()
      VMAPHandler.request = jest.fn(() => new Promise(resolve => resolve({ ok: 200, text: () => {} })))
      const response = VMAPHandler.request({ url: 'https://ad-server.com/test' })

      expect(response instanceof Promise).toBeTruthy()
    })

    it('throws one error if receives a invalid URL', async() => {
      const VMAPHandler = new VMAPManager()
      VMAPHandler.request = jest.fn(() => new Promise((_, reject) => reject('Network response was not ok')))

      await expect(VMAPHandler.request({ url: 'https://invali-ad-server.com/test', timeout: 2000 })).rejects.toMatch('Network response was not ok')
    })
  })

  describe('filterRawData method', () => {
    it('returns empty array for empty VMAP playlist', () => {
      const VMAPHandler = new VMAPManager()

      const response = VMAPHandler.filterRawData(null)

      expect(response.length).toEqual(0)
    })

    it('returns one array with AdBreaks', () => {
      const VMAPHandler = new VMAPManager()

      const response = VMAPHandler.filterRawData(standardParsedVMAPMock)

      expect(response.length).toEqual(3)
      expect(Object.keys(response[0])).toEqual(['category', 'adTag', 'timeOffset'])
      expect(Object.keys(response[1])).toEqual(['category', 'adTag', 'timeOffset'])
      expect(Object.keys(response[2])).toEqual(['category', 'adTag', 'timeOffset'])
    })

    it('supports IAB VMAP format', () => {
      const VMAPHandler = new VMAPManager()

      const response = VMAPHandler.filterRawData(standardParsedVMAPMock)

      expect(response[0].adTag).toHaveProperty('@templateType')
    })

    it('supports Custom VMAP format', () => {
      const VMAPHandler = new VMAPManager()

      const response = VMAPHandler.filterRawData(customParsedVMAPMock)

      expect(Array.isArray(response[0].adTag)).not.toHaveProperty('@templateType')
    })

    it('returns a rejected promise for IAB VMAP format decode errors', async() => {
      const VMAPHandler = new VMAPManager()
      const invalidStandardVMAP = standardParsedVMAPMock
      invalidStandardVMAP['vmap:AdBreak'] = 'invalid'
      const expectedErrorMessage = 'Cannot read properties of undefined (reading \'vmap:AdTagURI\')'

      await expect(VMAPHandler.filterRawData(invalidStandardVMAP)).rejects.toThrow(expectedErrorMessage)
    })

    it('returns a rejected promise for Custom VMAP format decode errors', async() => {
      const VMAPHandler = new VMAPManager()
      const expectedErrorMessage = 'Cannot read properties of null (reading \'Ad\')'

      await expect(VMAPHandler.filterRawData({ p: null, q: null })).rejects.toThrow(expectedErrorMessage)
    })
  })

  it('should resolve with parsed XML data', async() => {
    const mockXML = '<VMAP></VMAP>'
    const mockParsedData = { vmap: 'data' }
    const VMAPHandler = new VMAPManager()
    urlHandler.get.mockImplementation((url, options, callback) => callback(null, mockXML))
    xml2json.mockReturnValue(mockParsedData)

    const result = await VMAPHandler.request('https://ad-server.com/test', 2000)

    expect(urlHandler.get).toHaveBeenCalledWith('https://ad-server.com/test', { timeout: 2000 }, expect.any(Function))
    expect(xml2json).toHaveBeenCalledWith(mockXML)
    expect(result).toEqual(mockParsedData)
  })

  it('should handle timeout properly', async() => {
    const mockError = 'Timeout'
    const VMAPHandler = new VMAPManager()
    urlHandler.get.mockImplementation((url, options, callback) => setTimeout(() => callback(mockError, null), 3000))

    await expect(VMAPHandler.request('https://ad-server.com/test', 2000)).rejects.toEqual(mockError)

    expect(urlHandler.get).toHaveBeenCalledWith('https://ad-server.com/test', { timeout: 2000 }, expect.any(Function))
  })

  it('should handle empty XML response', async() => {
    urlHandler.get.mockImplementation((url, options, callback) => callback(null, ''))
    xml2json.mockReturnValue(null)
    const VMAPHandler = new VMAPManager()

    await expect(VMAPHandler.request('https://ad-server.com/test', 2000)).resolves.toBeNull()

    expect(urlHandler.get).toHaveBeenCalledWith('https://ad-server.com/test', { timeout: 2000 }, expect.any(Function))
    expect(xml2json).toHaveBeenCalledWith('')
  })
})

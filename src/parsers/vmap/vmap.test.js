/**
 * @jest-environment jsdom
 */

import VMAPManager from './vmap'
import { customParsedVMAPMock, standardParsedVMAPMock } from '@/mocks/valid-vmap'

describe('VMAPManager', () => {
  afterEach(() => { fetch.mockClear() })

  describe('request method', () => {
    it('returns a promise', () => {
      global.fetch = jest.fn(() => new Promise(resolve => resolve({ ok: 200, text: () => {} })))

      const VASTHandler = new VMAPManager()
      const response = VASTHandler.request('https://ad-server.com/test')

      expect(response instanceof Promise).toBeTruthy()
    })

    it('throws one error if receives a invalid URL', async () => {
      global.fetch = jest.fn(() => new Promise((_, reject) => reject('Network response was not ok')))
      const VASTHandler = new VMAPManager()

      await expect(VASTHandler.request('https://invali-ad-server.com/test')).rejects.toMatch('Network response was not ok')
    })
  })

  describe('filterRawData method', () => {
    it('returns one array with AdBreaks', () => {
      const VASTHandler = new VMAPManager()

      const response = VASTHandler.filterRawData(standardParsedVMAPMock)

      expect(response.length).toEqual(3)
      expect(Object.keys(response[0])).toEqual([ 'category', 'adTag', 'timeOffset' ])
      expect(Object.keys(response[1])).toEqual([ 'category', 'adTag', 'timeOffset' ])
      expect(Object.keys(response[2])).toEqual([ 'category', 'adTag', 'timeOffset' ])
    })

    it('supports IAB VMAP format', () => {
      const VASTHandler = new VMAPManager()

      const response = VASTHandler.filterRawData(standardParsedVMAPMock)

      expect(response[0].adTag).toHaveProperty('@templateType')
    })

    it('supports Custom VMAP format', () => {
      const VASTHandler = new VMAPManager()

      const response = VASTHandler.filterRawData(customParsedVMAPMock)

      expect(Array.isArray(response[0].adTag)).not.toHaveProperty('@templateType')
    })

    it('returns a rejected promise for IAB VMAP format decode errors', async () => {
      const VASTHandler = new VMAPManager()
      const invalidStandardVMAP = standardParsedVMAPMock
      invalidStandardVMAP['vmap:AdBreak'] = 'invalid'

      await expect(VASTHandler.filterRawData(invalidStandardVMAP)).rejects.toThrow('Cannot read property \'vmap:AdTagURI\' of undefined')
    })

    it('returns a rejected promise for Custom VMAP format decode errors', async () => {
      const VASTHandler = new VMAPManager()

      await expect(VASTHandler.filterRawData({ p: null, q: null })).rejects.toThrow('Cannot read property \'Ad\' of null')
    })
  })
})

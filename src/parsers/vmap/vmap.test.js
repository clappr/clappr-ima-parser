/**
 * @jest-environment jsdom
 */

import VMAPManager from './vmap'
import AdBreak from '@/entities/ad-break'
import { customParsedVMAPMock, standardParsedVMAPMock } from '@/mocks/valid-vmap'

describe('VMAPManager', () => {
  afterEach(() => { fetch.mockClear() })

  describe('request method', () => {
    test('returns a promise', () => {
      global.fetch = jest.fn(() => new Promise(resolve => resolve({ ok: 200, text: () => {} })))

      const VASTHandler = new VMAPManager()
      const response = VASTHandler.request('https://ad-server.com/test')

      expect(response instanceof Promise).toBeTruthy()
    })

    test('throws one error if receives a invalid URL', () => {
      global.fetch = jest.fn(() => new Promise((_, reject) => reject('Network response was not ok')))
      const VASTHandler = new VMAPManager()

      expect(VASTHandler.request('https://invali-ad-server.com/test')).rejects.toMatch('Network response was not ok')
    })
  })

  describe('filterRawData method', () => {
    test('returns one array with AdBreaks', () => {
      const VASTHandler = new VMAPManager()

      const response = VASTHandler.filterRawData(standardParsedVMAPMock)

      expect(response.length).toEqual(3)
      expect(response[0] instanceof AdBreak).toBeTruthy()
      expect(response[1] instanceof AdBreak).toBeTruthy()
      expect(response[2] instanceof AdBreak).toBeTruthy()
    })

    test('supports IAB VMAP format', () => {
      const VASTHandler = new VMAPManager()

      const response = VASTHandler.filterRawData(standardParsedVMAPMock)

      expect(response[0].adTag).toHaveProperty('@templateType')
    })

    test('supports Custom VMAP format', () => {
      const VASTHandler = new VMAPManager()

      const response = VASTHandler.filterRawData(customParsedVMAPMock)

      expect(Array.isArray(response[0].adTag)).not.toHaveProperty('@templateType')
    })

    test('returns a rejected promise for IAB VMAP format decode errors', () => {
      const VASTHandler = new VMAPManager()
      const invalidStandardVMAP = standardParsedVMAPMock
      invalidStandardVMAP['vmap:AdBreak'] = 'invalid'

      expect(VASTHandler.filterRawData(invalidStandardVMAP)).rejects.toThrow('Cannot read property \'vmap:AdTagURI\' of undefined')
    })

    test('returns a rejected promise for Custom VMAP format decode errors', () => {
      const VASTHandler = new VMAPManager()

      expect(VASTHandler.filterRawData({ p: null, q: null })).rejects.toThrow('Cannot read property \'Ad\' of null')
    })
  })
})

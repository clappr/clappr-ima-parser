import { Log } from '@clappr/core'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'

export default class IMAParser {
  constructor() {
    this._VMAPHandler = new VMAPManager()
    this.VASTHandler = new VASTManager()
  }

  /**
   * Get a list of AdBreaks from the received URL.
   * @param {string} url - The URL to request AdBreak data from.
   * @param {number} timeout - The timeout value for the request.
   * @returns {Promise} Promise resolved with one array of AdBreaks or one error.
   */
  requestAdBreaks(url, timeout) {
    return this._VMAPHandler.request(url, timeout)
      .then(rawAdBreak => this._VMAPHandler.filterRawData(rawAdBreak))
      .then(adBreaks => {
        Log.info(this.name, 'Available adBreaks: ', adBreaks)
        return adBreaks
      })
      .catch(error => {
        Log.error(this.name, 'Fail to request VMAP: ', error)
        return Promise.reject(error)
      })
  }

  /**
   * Get a list of ads available from the received Ad tag.
   * @param {Object} adTag  Ad tag URL to fetch VAST.
   * @param {Object} timeout  A custom timeout for the requests.
   * @returns {Promise<{ ads: Array, errors: Error[] }>} Ads from successful responses and request errors from failed ones.
   *   Empty ads with empty errors means no-fill. The promise rejects only when adTag is missing.
   */
  requestAds(adTag, timeout) {
    return this.VASTHandler.request(adTag, timeout)
  }
}

export { VASTTracker } from '@dailymotion/vast-client'

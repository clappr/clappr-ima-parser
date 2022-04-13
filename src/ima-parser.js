import { Log } from '@clappr/core'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'

export default class IMAParser {
  constructor() {
    this._VMAPHandler = new VMAPManager()
    this._VASTHandler = new VASTManager()
  }

  /**
   * Get a list of AdBreaks from the received URL.
   * @param {String} url Ad Server URL to fetch VMAP XML.
   * @returns {Promise} Promise resolved with one array of AdBreaks or one error.
   */
  requestAdBreaks(url) {
    return this._VMAPHandler.request(url)
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
   * @returns {Promise} Promise resolved with current available ads of the respected Ad tag.
   */
  requestAds(adTag) {
    return this._VASTHandler.request(adTag)
      .then(ad => {
        return ad
      })
      .catch(error => Promise.reject(error))
  }
}

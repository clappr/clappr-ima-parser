import { CorePlugin, Log, version } from '@clappr/core'
import VMAPManager from './parsers/vmap'
import VASTManager from './parsers/vast'

export default class IMAParserPlugin extends CorePlugin {
  get name() { return 'ima_parser' }

  get supportedVersion() { return { min: version } }

  constructor(core) {
    super(core)
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
      .then(xmlPlainText => this._VMAPHandler.process(xmlPlainText))
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
   * Get a list of ads available from the received AdBreak.
   * @param {Object} adBreak An adBreak entity.
   * @returns {Promise} Promise resolved with one array of current available ads of the respected AdBreak.
   */
  requestAd(adBreak) {
    return this._VASTHandler.request(adBreak.adTag)
      .then(ad => {
        adBreak.addAd(ad)
        Log.info('AdBreak', 'Added to ads list: ', adBreak.ads[adBreak.ads.length - 1])
        return adBreak.ads
      })
      .catch(error => Promise.reject(error))
  }
}

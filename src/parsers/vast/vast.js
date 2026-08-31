import { VASTClient } from '@dailymotion/vast-client'
import AdBreak from './adbreak'

/**
 * Lib default timeout.
 * https://github.com/dailymotion/vast-client-js/blob/master/docs/api/vast-client.md#parameters-1
 */
const defaultTimeout = 120000

const toError = error => (error instanceof Error ? error : new Error(error))

export default class VASTManager {
  /**
   * Initialize a new VastManager instance with one VASTClient lib instance.
   */
  constructor() {
    this.client = new VASTClient()
  }

  /**
   * Request VAST XML and returns ads plus any request failures.
   * @param {Object} adData Contains the url to fetch the VAST document.
   * @param {Object} timeout  A custom timeout for the requests.
   * @returns {Promise<{ ads: Array, errors: Error[] }>} Ads from successful responses and request errors from failed ones.
   *   Empty ads with empty errors means no-fill. The promise rejects only when adData is missing.
   * @see {@link https://github.com/dailymotion/vast-client-js/blob/master/docs/api/class-reference.md#ad}
   */
  request(adData, timeout) {
    this.timeout = timeout || defaultTimeout

    return adData
      ? this._processAdData(adData)
      : Promise.reject(toError('Invalid adTag received to request VAST'))
  }

  _processAdData(adBreakContent) {
    const adBreak = new AdBreak(adBreakContent)
    const vastRequests = []

    adBreak.adDataUrls.forEach(adUrl => {
      vastRequests.push(this._requestVASTAdInformation(adUrl))
    })

    return Promise.all(vastRequests).then(results => this._getAdsFromVast(results))
  }

  _getAdsFromVast(vastRequestsResult) {
    return vastRequestsResult.reduce((aggregated, result) => {
      result && Array.isArray(result.ads) && aggregated.ads.push(...result.ads)
      result && Array.isArray(result.errors) && aggregated.errors.push(...result.errors)
      return aggregated
    }, { ads: [], errors: [] })
  }

  _requestVASTAdInformation(adUrl) {
    return this.client.get(adUrl, { wrapperLimit: 5, withCredentials: true, resolveAll: false, timeout: this.timeout })
      .then(response => this._filterOrGetNextAds(response))
      .catch(error => ({ ads: [], errors: [toError(error)] }))
  }

  _filterOrGetNextAds(response, adsToReturn = [], errors = []) {
    const { ads } = response
    if (!ads || ads.length === 0)
      return Promise.resolve({ ads: adsToReturn, errors })

    return ads.reduce((chain, ad) => chain.then(() => {
      const hasMediaFiles = ad.creatives && ad.creatives.some(creative => creative.mediaFiles)
      if (!hasMediaFiles && this.client.hasRemainingAds())
        return this.client.getNextAds()
          .then(next => this._filterOrGetNextAds(next, adsToReturn, errors))
          .catch(error => errors.push(toError(error)))
      adsToReturn.push(ad)
    }), Promise.resolve()).then(() => ({ ads: adsToReturn, errors }))
  }
}

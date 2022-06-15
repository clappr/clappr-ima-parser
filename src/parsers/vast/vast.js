import { VASTClient } from 'vast-client'
import AdBreak from './adbreak'
export default class VASTManager {
  /**
   * Initialize a new VastManager instance with one VASTClient lib instance.
   */
  constructor() {
    this.client = new VASTClient()
  }

  /**
   * Request VAST XML and returns one VASTResponse.Ad entity.
   * @param {Object} adData Contains the url to fetch the VAST document.
   * @returns {Promise} Promise resolved with one VASTResponse.Ad entity or one error.
   * @see {@link https://github.com/dailymotion/vast-client-js/blob/master/docs/api/class-reference.md#ad}
   */
  request(adData) {
    return adData
      ? this._processAdData(adData)
      : Promise.reject('Invalid adTag received to request VAST')
  }

  _processAdData(adBreakContent) {
    const adBreak = new AdBreak(adBreakContent)
    const vastRequests = []

    adBreak.adDataUrls.forEach(adUrl => {
        vastRequests.push(this._requestVASTAdInformation(adUrl))
    })

    return Promise.all(vastRequests).then(this._getAdsFromVast)
  }

  _getAdsFromVast(vastRequestsResult) {
    return vastRequestsResult.reduce((ads, adsList) => {
      Array.isArray(adsList) && ads.push(...adsList)
      return ads
    }, [])
  }

  _requestVASTAdInformation(adUrl) {
    return this.client.get(adUrl, { wrapperLimit: 5, withCredentials: true, resolveAll: false })
      .then(this._filterOrGetNextAds)
      .catch(error => error)
  }

  _filterOrGetNextAds(response, adsToReturn = []) {
    const { ads } = response
    if (!ads || ads.length === 0) throw new Error('Empty ads')

    ads.forEach(ad => {
      const hasMediaFiles = ad.creatives && ad.creatives.some(creative => creative.mediaFiles)
      if (!hasMediaFiles && this.client.hasRemainingAds()) {
        this.client.getNextAds().then(response => this._filterOrGetNextAds(response, adsToReturn))
      } else {
        adsToReturn.push(ad)
      }
    })

    return adsToReturn
  }
}

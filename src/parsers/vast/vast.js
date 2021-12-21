import { VASTClient } from 'vast-client'

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
    const formattedAdBreakContent = Array.isArray(adBreakContent) ? adBreakContent[0] : adBreakContent

    if (!/vad_type=linear/.test(formattedAdBreakContent['#cdata'])) return Promise.reject('Invalid ads')
    const editedAdUrl = formattedAdBreakContent['#cdata'].replace(/[\s\n]+/, '')

    return this._requestVASTAdInformation(editedAdUrl)
  }

  _requestVASTAdInformation(adUrl) {
    return this.client.get(adUrl, { wrapperLimit: 5, withCredentials: true, resolveAll: false })
      .then(response => this._filterOrGetNextAds(response))
  }

  _filterOrGetNextAds(response) {
    const { ads } = response

    if (!ads || ads.length === 0) throw new Error('Empty ads')

    // TODO: support for ad pods (n ads)
    const hasMediaFiles = ads[0].creatives.some(creative => creative.mediaFiles)
    if ((!ads[0].creatives || !hasMediaFiles) && this.client.hasRemainingAds())
      return this.client.getNextAds().then(response => this._filterOrGetNextAds(response))

    return ads[0]
    // TODO: support for ad pods (n ads)
  }
}

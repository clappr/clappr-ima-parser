export default class AdBreak {
  get ads() { return this._ads }

  get category() { return this._config.category }

  get timeOffset() { return this._config.timeOffset }

  get adTag() { return this._config.adTag }

  constructor(config) {
    this._ads = []
    this._config = config
  }

  addAd(ad) {
    this._ads.push(ad)
  }

  hasAds() {
    return this._ads.length > 0
  }
}

class AdBreak {
    constructor(adData) {
      this.content = Array.isArray(adData) ? adData : [adData]
    }

    get adDataUrls() {
      return this.content.map(this.formatUrlString)
    }

    formatUrlString(adUrl) {
      return adUrl['#cdata'].replace(/[\s\n]+/, '')
    }
}

export default AdBreak

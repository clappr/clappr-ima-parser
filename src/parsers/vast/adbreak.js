class AdBreak {
  constructor(adData) {
    this.content = Array.isArray(adData) ? adData : [adData]
  }

  get adDataUrls() {
    return this.content.map(this.formatUrlString).filter(Boolean)
  }

  formatUrlString(adUrl) {
    const raw = adUrl && (adUrl['#cdata'] || adUrl['#text'])
    if (typeof raw !== 'string') return
    return raw.replace(/[\s\n]+/, '')
  }
}

export default AdBreak

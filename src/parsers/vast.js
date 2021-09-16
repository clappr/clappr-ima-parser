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
   * @param adData Object that contains the url to fetch the VAST document.
   * @returns {Promise} Promise resolved with one VASTResponse.Ad entity or one error.
   * @see {@link https://github.com/dailymotion/vast-client-js/blob/master/docs/api/class-reference.md#ad}
   */
  request(adData) {
    return adData
      ? this._processAdData(adData)
        .then(ads => ads)
        .catch(error => Promise.reject(error))
      : Promise.reject('Invalid adTag received to request VAST')
  }

  _processAdData(adBreakContent) {
    const formattedAdBreakContent = Array.isArray(adBreakContent) ? adBreakContent[0] : adBreakContent

    if (!/vad_type=linear/.test(formattedAdBreakContent['#cdata'])) throw new Error('Invalid ads')
    const editedAdUrl = formattedAdBreakContent['#cdata'].replace(/[\s\n]+/, '')

    return this._requestVASTAdInformation(editedAdUrl)
      .then(arrayResults => arrayResults)
      .catch(error => Promise.reject(error))
  }

  _requestVASTAdInformation(adUrl) {
    return this.client.get(adUrl, { wrapperLimit: 5, withCredentials: true, resolveAll: false })
      .then(response => this._filterOrGetNextAds(response))
      .catch(error => Promise.reject(error))
  }

  _filterOrGetNextAds(response) {
    const { ads } = response

    if (ads.length === 0) throw new Error('Empty ads')

    // TODO: support for ad pods (n ads)
    const hasMediaFiles = ads[0].creatives.some(creative => creative.mediaFiles)
    if (!ads[0].creatives || !hasMediaFiles)
      return this.client.hasRemainingAds() && this.client.getNextAds()
        .then(response => this._filterOrGetNextAds(response))
        .catch(error => Promise.reject(error))

    return ads[0]
    // TODO: support for ad pods (n ads)
  }

  // filterAdCreatives(data) {
  //   return new Promise((resolve, reject) => {
  //     if (data && data.creatives) {
  //       const creativePromises = data.creatives.map(creative => this.diFude(creative))

  //       Promise.race(creativePromises)
  //         .then(data => resolve(data))
  //         .catch(error => reject(error))
  //     } else {
  //       reject('No data.creatives')
  //     }
  //   })
  // }

  // diFude(creative) {
  //   return new Promise((resolve, reject) => {
  //     if (creative.mediaFiles) {
  //       const progressivePromises = []
  //       const adaptivePromises = []

  //       this.createMediaFiles(creative.mediaFiles, progressivePromises, adaptivePromises)

  //       if (progressivePromises.length === 0) progressivePromises.push(Promise.resolve())
  //       if (adaptivePromises.length === 0) adaptivePromises.push(Promise.resolve())

  //       Promise.all([
  //         Promise.race(progressivePromises),
  //         Promise.race(adaptivePromises),
  //       ]).then(([progressive, adaptive]) => {
  //         const skipOffset = creative.skipDelay // hmsToMilliseconds(creative.skipDelay)
  //         const ad = new Ad(skipOffset * 1000) // convert to ms
  //         if (progressive) ad.setProgressive(progressive)
  //         if (adaptive) ad.setAdaptive(adaptive)
  //         if (progressive || adaptive) {
  //           ad.setCreative(creative)
  //           resolve(ad)
  //         } else {
  //           reject()
  //         }
  //       }).catch(error => reject(error))
  //     } else {
  //       reject('No creative.mediaFiles')
  //     }
  //   })
  // }

  // createMediaFiles(mediaFiles, progressivePromises, adaptivePromises) {
  //   for (let j = 0; j < mediaFiles.length; j++) {
  //     const mediaFile = mediaFiles[j]
  //     if (mediaFile.mimeType) {
  //       const parsedMedia = { media: mediaFile.fileURL, bitrate: mediaFile.bitrate, type: mediaFile.mimeType }

  //       switch (mediaFile.mimeType) {
  //       case 'video/webm':
  //       case 'video/3gpp':
  //       case 'video/mp4':
  //         progressivePromises.push(Promise.resolve(new MediaFile(parsedMedia)))
  //         break
  //       case 'application/x-mpegURL':
  //       case 'application/vnd.apple.mpegurl': {
  //         adaptivePromises.push(new Promise(resolve => {
  //           this.validateHLS(mediaFile.fileURL)
  //             .then(() => resolve(new MediaFile(parsedMedia)))
  //             .catch(() => resolve())
  //         }))
  //         break
  //       }
  //       // Disable by now, it's producing errors on WebOS
  //       case 'application/dash+xml':
  //       default:
  //         // adaptivePromises.push(new MediaFile(parsedMedia))
  //         break
  //       }
  //     }
  //   }
  // }

  // validateHLS(url) {
  //   console.log('>>>>>> validateHLS() with URL: ', url)
  //   return fetch(url, { mode: 'no-cors', credentials: 'omit' })
  //     .then(response => response.text())
  //     .then(text => {
  //       if (text && text.indexOf)
  //         return text.indexOf('#EXT-X-VERSION:3') >= 0
  //           ? Promise.resolve()
  //           : Promise.reject('HLS version not compatible')

  //       return Promise.reject()
  //     })
  //     .catch(error => error)
  // }
}
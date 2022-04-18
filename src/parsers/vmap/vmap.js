import { Log } from '@clappr/core'
import { hmsToMilliseconds } from '@/utils/str-to-time'
import xml2json from '@/converts/xml2json'

export default class VMAPManager {
  /**
   * Request VMAP XML and parses to JSON.
   * @param {String} URL ad server URL to request VMAP file.
   * @returns {Promise} Promise resolved with raw AdBreaks list or one error.
   */
  request(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')

        return response.text()
      }).then(responseInPlainText => {
        const parser = new DOMParser()
        const xml = parser.parseFromString(responseInPlainText, 'application/xml')
        const rawAdBreaks = xml2json(xml.documentElement)

        return rawAdBreaks
      })
  }

  /**
   * Receives one VMAP formatted response and return a list of AdBreaks instances.
   * @param {Object} rawData VMAP formatted on JSON schema.
   * @returns {Array} All AdBreaks instances created or one error.
   */
  filterRawData(rawData) {
    return rawData['@version'] && rawData['vmap:AdBreak']
      ? this._filterStandardRawData(rawData)
      : this._filterCustomRawData(rawData)
  }

  _filterStandardRawData(rawData) {
    const adBreaks = []

    try {
      // Formatting all ad breaks with same structure to simplify manipulations.
      const vmapAdBreaks = Array.isArray(rawData['vmap:AdBreak'])
        ? rawData['vmap:AdBreak']
        : [rawData['vmap:AdBreak']]

      vmapAdBreaks.forEach(item => {
        let timeOffset = item['@timeOffset']
        let category = ''

        if (timeOffset === 'start') {
          category = 'preroll'
          timeOffset = null
        } else if (timeOffset === 'end') {
          category = 'postroll'
          timeOffset = null
        } else {
          category = 'midroll'
        }

        const adBreak = {
          category,
          adTag: item['vmap:AdSource']['vmap:AdTagURI'],
          timeOffset: this.formatTimeOffset(timeOffset)
        }

        adBreaks.push(adBreak)
      })
    } catch (error) {
      Log.error(this.name, 'Build AdBreak process fail', error)
      return Promise.reject(error)
    }

    return adBreaks
  }

  _filterCustomRawData(rawData) {
    const adBreaks = []
    const rawDataOnArray = Object.entries(rawData)

    try {
      for (let [category, adData] of rawDataOnArray) {
        // Only Mid-roll is structured on array by default.
        // Formatting all ad breaks with same structure to simplify manipulations.
        adData = Array.isArray(adData) ? adData : [adData]

        const adBreak = adData.map(content => {
          return {
            category,
            adTag: content.Ad,
            timeOffset: this.formatTimeOffset(content['@timeOffset'])
          }
        })

        adBreaks.push(...adBreak)
      }
    } catch (error) {
      Log.error(this.name, 'Build AdBreak process fail', error)
      return Promise.reject(error)
    }

    return adBreaks
  }

  /**
   * Receives and return adBreakConfig
   * @param {Object} adBreakConfig
   * @returns {Object} adBreakConfig
   */
   formatTimeOffset(timeOffset) {
    return timeOffset ? hmsToMilliseconds(timeOffset) : null
  }
}

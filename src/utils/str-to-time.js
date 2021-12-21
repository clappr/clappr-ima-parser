const SECONDS_TO_MILLISECONDS = 1000
const MINUTES_TO_MILLISECONDS = 60000
const HOURS_TO_MILLISECONDS = 3600000

/**
 * Transforms the given string duration time into milliseconds.
 *
 * @param {string} adsTimeOffset - The offset time 00:00:00 format.
 */
export const hmsToMilliseconds = adsTimeOffset => {
  if (adsTimeOffset && adsTimeOffset.split) {
    const values = adsTimeOffset.split(':')

    return parseInt(values[2], 10) * SECONDS_TO_MILLISECONDS
      + parseInt(values[1], 10) * MINUTES_TO_MILLISECONDS
      + parseInt(values[0], 10) * HOURS_TO_MILLISECONDS
  }

  return null
}

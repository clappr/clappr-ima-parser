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

    if (values.length !== 3) return null

    const [hours, minutes, seconds] = values.map(part => parseInt(part, 10))

    if ([hours, minutes, seconds].some(Number.isNaN)) return null

    return seconds * SECONDS_TO_MILLISECONDS
      + minutes * MINUTES_TO_MILLISECONDS
      + hours * HOURS_TO_MILLISECONDS
  }

  return null
}

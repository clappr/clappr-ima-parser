import { CorePlugin, version } from '@clappr/core'

export default class IMAParserPlugin extends CorePlugin {
  get name() { return 'ima_parser' }

  get supportedVersion() { return { min: version } }

  constructor(core) {
    super(core)
    console.log(`${this.name} plugin loaded!`)
  }
}

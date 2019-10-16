import createStorage from 'refdata-storage'
import FilesystemChangelogAdapter from 'refdata-storage-filesystem-changelog'

export class StorageAdapter {
  private logger
  private schemaLocation
  private storage

  constructor({ logger, schemaLocation }) {
    this.logger = logger
    this.schemaLocation = schemaLocation

    this.storage = createStorage({
      index: 'default',
      log: {
        schema: new FilesystemChangelogAdapter({
          workingDirectory: this.schemaLocation,
          format: 'json'
        }),
        entity: 'default'
      }
    })
  }

  async init() {
    this.logger.info(`[Storage Adapter] starting with schema from: ${this.schemaLocation}`)
    await this.storage.init()
  }

  async stop() {
    this.logger.info('[Storage Adapter] stopping')
  }

  isConnected() {
    return true
  }

  findSchema(query) {
    return this.storage.findSchema(query)
  }
}

import createStorage from 'refdata-storage'
import { ValidationError } from '../errors/validation-error'
import { StringMap, LoggerInterface } from '../types'

type ConfigType = {
  logger: LoggerInterface,
  schema: object[]
}

export class StorageAdapter {
  private logger: LoggerInterface
  private storage

  constructor({ logger, schema }: ConfigType) {
    this.logger = logger
    this.storage = createStorage({ schema })
  }

  async init() {
    this.logger.info('[Storage Adapter] starting')
    await this.storage.init()
  }

  async stop() {
    this.logger.info('[Storage Adapter] stopping')
  }

  isConnected() {
    return true
  }

  schemaNames() {
    return this.storage.schemaNames()
  }

  getSchema(name: string) {
    return this.storage.getSchema(name)
  }

  find(type: string, query: StringMap) {
    return this.storage.find({ ...query, type, isDeleted: false })
  }

  validate(type: string, data: StringMap) {
    return this.storage.validate(type, data)
  }

  create(type: string, data: StringMap) {
    const errors = this.storage.validate(type, data)
    if (errors) {
      throw new ValidationError(errors)
    }

    return this.storage.create(type, data)
  }

  async get(id: string) {
    try {
      const entity = await this.storage.get(id)
      if (entity.body.isDeleted) {
        return
      }

      return entity
    } catch(e) {
      return
    }
  }

  update(id: string, data: StringMap) {
    return this.storage.update(id, data)
  }

  async delete(id: string) {
    const entity = await this.storage.get(id)
    if (!entity || entity.body.isDeleted) {
      return
    }

    return this.storage.update(id, {
      ...entity.body,
      isDeleted: true
    })
  }
}

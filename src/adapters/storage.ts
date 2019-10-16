import createStorage from 'refdata-storage'
import { ValidationError } from './errors/validation-error'
import { StringMap, LoggerInterface, StorageInterface, Initializable } from '../types'

type ConfigType = {
  logger: LoggerInterface,
  schema: object[]
}

export class StorageAdapter implements StorageInterface, Initializable {
  private logger: LoggerInterface
  private storage

  constructor({ logger, schema }: ConfigType) {
    this.logger = logger
    this.storage = createStorage({ schema })
  }

  async up() {
    this.logger.info('[Storage Adapter] starting')
    await this.storage.init()
  }

  async down() {
    this.logger.info('[Storage Adapter] stopping')
  }

  async isHealthy() {
    return true
  }

  schemaNames() {
    return this.storage.schemaNames()
  }

  getSchema(name: string) {
    return this.storage.getSchema(name)
  }

  async find(type: string, query: StringMap) {
    return this.storage.find({ ...query, type, isDeleted: false })
  }

  async create(type: string, data: StringMap) {
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

  async update(id: string, data: StringMap) {
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

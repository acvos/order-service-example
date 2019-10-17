import createStorage from 'refdata-storage'
import * as sortOn from 'sort-on'
import { ValidationError } from '../errors/validation-error'
import { LoggerInterface, RepositoryInterface, Initializable, Entity } from '../types'

type ConfigType = {
  logger: LoggerInterface,
  schema: object
  type: string
}

export class Repository implements RepositoryInterface, Initializable {
  private storage
  private type: string

  constructor({ logger, schema, type }: ConfigType) {
    this.type = type
    this.storage = createStorage({ schema: [schema], logger })
  }

  up() {
    return this.storage.init()
  }

  async down() {}

  isConnected() {
    return this.storage.isConnected()
  }

  async find(query, sortBy = 'created_at'): Promise<Entity[]> {
    // Refdata storage at the moment doesn't support sorting
    const collection = await this.storage.find({ ...query, type: this.type, isDeleted: false })
    return sortOn(collection, sortBy)
  }

  create(data) {
    const errors = this.storage.validate(this.type, data)
    if (errors) {
      throw new ValidationError(errors)
    }

    return this.storage.create(this.type, data)
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

  async update(id: string, data) {
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

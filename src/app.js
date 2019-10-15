import map from 'poly-map'
import storage from './adapters/storage'

export const findSchemata = req => storage.findSchema(req.params)

export const findSchemaNames = req => storage.findSchema(req.params).then(map(x => x.body.name))

export const getSchema = req => storage.getSchema(req.params.name)

export const get = req => storage.get(req.params.id, req.params.version)

export const findAll = req => storage.find(req.params)

export const countAll = req => storage.find(req.params).then(xs => ({ count: xs.length }))

export const find = req => storage.find({
  ...req.params,
  type: req.params.type
})

export const create = async (req, res) => {
  const entityType = req.params.type
  const entityData = req.body

  // storage.create will throw validation errors
  const entity = await storage.create(entityType, entityData)
  res.status(201)

  return entity
}

export const update = async (req) => {
  const entityId = req.params.id
  const entityData = req.body

  // storage.update will throw error when new version is identical to the current one
  const entity = await storage.update(entityId, entityData)

  return entity
}

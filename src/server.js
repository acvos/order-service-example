import { ExpressWebServer } from './adapters/express-server'
import { logger } from './adapters/logger'
import { StorageAdapter } from './adapters/storage'
import * as app from './app'

const storage = new StorageAdapter({
  logger,
  schemaLocation: process.env.SCHEMA_LOCATION
})

const httpServer = new ExpressWebServer({
  logger,
  port: process.env.PORT,
  healthChecks: [{
    handler: storage.isConnected,
    message: 'Storage down'
  }]
})

httpServer.mount('get', '/types', app.findSchemaNames)
httpServer.mount('get', '/schemata', app.findSchemata)
httpServer.mount('get', '/schema/:name', app.getSchema)

httpServer.mount('get', '/document/:id', app.get)
httpServer.mount('put', '/document/:id', app.update)
httpServer.mount('get', '/document/:id/v/:version', app.get)

httpServer.mount('get', '/documents', app.findAll)
httpServer.mount('get', '/documents/count', app.countAll)
httpServer.mount('get', '/documents/:type', app.find)
httpServer.mount('post', '/documents/:type', app.create)
httpServer.mount('get', '/documents/:type/:id', app.get)
httpServer.mount('get', '/documents/:type/:id/v/:version', app.get)
httpServer.mount('put', '/documents/:type/:id', app.update)

export async function up() {
  await storage.init()
  await httpServer.start()
}

export async function down() {
  await storage.stop()

  if (httpServer) {
    await httpServer.stop()
  }
}

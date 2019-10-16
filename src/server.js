import { ExpressWebServer } from './adapters/express-server'
import { logger } from './adapters/logger'
import { StorageAdapter } from './adapters/storage'
import { App } from './app'

const storage = new StorageAdapter({
  logger,
  schemaLocation: process.env.SCHEMA_LOCATION
})

const app = new App({ storage })

const httpServer = new ExpressWebServer({
  logger,
  port: process.env.PORT,
  healthChecks: [{
    handler: storage.isConnected,
    message: 'Storage down'
  }]
})

httpServer.mount('get', '/types', app.findSchemaNames)
httpServer.mount('get', '/types/:name', app.getSchema)

httpServer.mount('get', '/coffee-shops', app.listCoffeeShops)
httpServer.mount('post', '/coffee-shops', app.registerCoffeeShop)
httpServer.mount('get', '/coffee-shops/:id', app.getCoffeeShop)
httpServer.mount('put', '/coffee-shops/:id', app.updateCoffeeShop)
httpServer.mount('delete', '/coffee-shops/:id', app.deleteCoffeeShop)

httpServer.mount('get', '/coffee-shops/:shopId/orders', app.listOrders)
httpServer.mount('post', '/coffee-shops/:shopId/orders', app.placeOrder)
httpServer.mount('get', '/coffee-shops/:shopId/orders/:id', app.getOrder)
httpServer.mount('put', '/coffee-shops/:shopId/orders/:id', app.changeOrder)
httpServer.mount('delete', '/coffee-shops/:shopId/orders/:id', app.deleteOrder)

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

import { ExpressWebServer } from './adapters/express-server'
import { logger } from './adapters/logger'
import { StorageAdapter } from './adapters/storage'
import { App } from './app'
import { HttpApi } from './http-api'
import { schema as shopSchema }from './schema/coffee-shop'
import { schema as orderSchema }from './schema/order'

// Ports
const storage = new StorageAdapter({
  logger,
  schema: [shopSchema, orderSchema]
})

const server = new ExpressWebServer({
  logger,
  port: process.env.PORT
})

async function up() {
  await storage.up()
  await server.up()
}

async function down() {
  await storage.down()
  await server.down()
}

// Core
const app = new App({ storage })

// API
new HttpApi({
  storage,
  app,
  server,
  debug: (process.env.DEBUG === 'true' || process.env.DEBUG === '1')
})

// Event binding
process.on('SIGINT', async () => {
  logger.warn('SIGINT received! Exiting...')

  await down()
  process.exit()
})

process.on('SIGHUP', async () => {
  logger.warn('SIGHUP received! Restarting...')

  await down()
  await up()
})

up()

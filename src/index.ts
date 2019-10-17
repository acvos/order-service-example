import { ExpressWebServer } from './adapters/express-server'
import { logger } from './adapters/logger'
import { App } from './app'
import { HttpApi } from './http-api'

const server = new ExpressWebServer({
  logger,
  port: process.env.PORT
})

async function up() {
  await app.up()
  await server.up()
}

async function down() {
  await app.down()
  await server.down()
}

const app = new App({
  logger,
  dateTimeFormat: 'YYYY-MM-DD HH:mm'
})

new HttpApi({ app, server })

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

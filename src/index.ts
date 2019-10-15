import { up, down } from './server'
import { logger } from './adapters/logger'

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

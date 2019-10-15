import * as bunyan from 'bunyan'

if (!process.env.SERVICE_NAME) {
  throw new Error('[Logger] SERVICE_NAME environment variable is not provided')
}

export const logger = bunyan.createLogger({ name: process.env.SERVICE_NAME })

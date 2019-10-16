import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressLogging from 'express-logging'
import * as cors from 'cors'
import { LoggerInterface } from '../types'

export class ExpressWebServer {
  private logger: LoggerInterface
  private server
  private port

  constructor({ port, logger }) {
    this.port = port
    this.logger = logger

    this.server = express()
    this.server.use(cors())
    this.server.use(bodyParser.json())
    this.server.use(bodyParser.text())
    this.server.use(expressLogging(this.logger))
  }

  async processRequest(handler, successStatus, req, res) {
    const params = { ...(req.params || {}), ...(req.query || {}) }

    try {
      const data = await handler({ params, body: req.body })

      if (data === undefined) {
        res.status(404).send()
      } else {
        res.status(successStatus).send(data)
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        this.logger.warn(err)
        res.status(400).send({ message: err.message })
      } else {
        this.logger.error(err)
        res.status(500).send({ message: 'Server error' })
      }
    }
  }

  mount(method, route, handler, successStatus = 200) {
    this.server[method](route, (req, res) => this.processRequest(handler, successStatus, req, res))
  }

  start() {
    return new Promise((resolve) => {
      this.server.$nativeHttpServer = this.server.listen(
        this.port,
        () => {
          this.logger.info(`[HTTP Server] listening on port ${this.port}`)
          resolve()
        }
      )
    })
  }

  stop() {
    return new Promise((resolve) => {
      if (!this.server.$nativeHttpServer) {
        resolve()
      }

      this.server.$nativeHttpServer.close(() => {
        this.logger.info('[HTTP Server] stopped')
        resolve()
      })
    })
  }
}

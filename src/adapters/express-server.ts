import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressLogging from 'express-logging'
import * as cors from 'cors'
import { ValidationError } from './errors/validation-error'
import { LoggerInterface, Initializable, HttpAdapterInterface } from '../types'

export class ExpressWebServer implements HttpAdapterInterface, Initializable {
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

  private async processRequest(handler, successStatus, req, res) {
    const params = { ...(req.params || {}), ...(req.query || {}) }

    try {
      const data = await handler({ params, body: req.body })

      if (data === undefined) {
        res.status(404).send()
      } else {
        res.status(successStatus).send(data)
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        this.logger.warn(err)
        res.status(400).send({ message: err.message })
      } else {
        this.logger.error(err)
        res.status(500).send({ message: 'Server error' })
      }
    }
  }

  get(route, handler) {
    this.server.get(route, (req, res) => this.processRequest(handler, 200, req, res))
  }

  post(route, handler) {
    this.server.post(route, (req, res) => this.processRequest(handler, 201, req, res))
  }

  put(route, handler) {
    this.server.put(route, (req, res) => this.processRequest(handler, 200, req, res))
  }

  patch(route, handler) {
    this.server.patch(route, (req, res) => this.processRequest(handler, 200, req, res))
  }

  delete(route, handler) {
    this.server.delete(route, (req, res) => this.processRequest(handler, 200, req, res))
  }

  up() {
    return new Promise<void>((resolve) => {
      this.server.$nativeHttpServer = this.server.listen(
        this.port,
        () => {
          this.logger.info(`[HTTP Server] listening on port ${this.port}`)
          resolve()
        }
      )
    })
  }

  down() {
    return new Promise<void>((resolve) => {
      if (!this.server.$nativeHttpServer) {
        resolve()
      }

      this.server.$nativeHttpServer.close(() => {
        this.logger.info('[HTTP Server] stopped')
        resolve()
      })
    })
  }

  async isHealthy() {
    return true
  }
}

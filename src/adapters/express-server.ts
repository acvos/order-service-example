import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressLogging from 'express-logging'
import * as cors from 'cors'

export class ExpressWebServer {
  private logger
  private healthChecks
  private server

  constructor({ logger, healthChecks = [] }) {
    this.logger = logger
    this.healthChecks = healthChecks

    this.server = express()
    this.server.use(cors())
    this.server.use(bodyParser.json())
    this.server.use(bodyParser.text())
    this.server.use(expressLogging(this.logger))

    // Maintenance endpoints
    this.server.get('/health', (req, res) => this.checkHealth(req, res))
  }

  checkHealth(req, res) {
    const failedChecks = this.healthChecks.filter(check => !check.handler())

    if (failedChecks.length) {
      res.status(500).json({
        status: 'error',
        details: failedChecks.map(check => check.message)
      })
    } else {
      res.json({ status: 'ok' })
    }
  }

  mount(method, route, handler) {
    this.server[method](route, (req, res) => {
      const params = { ...(req.params || {}), ...(req.query || {}) }

      try {
        return handler({ params, body: req.body }, res)
          .then(data => {
            if (data === undefined) {
              res.status(404).send()
            } else {
              res.send(data)
            }
          })
          .catch(err => {
            this.logger.error(err)
            res.status(500).send({ message: 'System error' })
          })
      } catch (err) {
        res.status(400).send({ message: err.message })
      }
    })
  }

  start(port) {
    return new Promise((resolve) => {
      this.server.$nativeHttpServer = this.server.listen(
        port,
        () => {
          this.logger.info(`[HTTP Server] listening on port ${port}`)
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

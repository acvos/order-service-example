import { HttpAdapterInterface } from './types'

export class HttpApi {
  private app
  private server: HttpAdapterInterface

  constructor({ server, app }) {
    this.app = app
    this.server = server

    this.server.get('/health', (req, res) => this.checkHealth(req, res))

    this.server.get('/coffee-shops', ({ params }) => app.listCoffeeShops(params))
    this.server.post('/coffee-shops', ({ body }) => app.registerCoffeeShop(body))
    this.server.get('/coffee-shops/:id', ({ params }) => app.getCoffeeShop(params.id))
    this.server.patch('/coffee-shops/:id', ({ params, body }) => app.updateCoffeeShop(params.id, body))
    this.server.delete('/coffee-shops/:id', ({ params }) => app.deleteCoffeeShop(params.id))

    this.server.get('/coffee-shops/:shopId/orders', ({ params }) => app.listOrders(params.shopId))
    this.server.post('/coffee-shops/:shopId/orders', ({ params, body }) => app.placeOrder(params.shopId, body))
    this.server.get('/coffee-shops/:shopId/orders/:id', ({ params }) => app.getOrder(params.shopId, params.id))
    this.server.patch('/coffee-shops/:shopId/orders/:id', ({ params, body }) => app.changeOrder(params.shopId, params.id, body))
    this.server.delete('/coffee-shops/:shopId/orders/:id', ({ params }) => app.deleteOrder(params.shopId, params.id))
  }

  async checkHealth(req, res) {
    if (await this.app.isHealthy()) {
      res.json({ status: 'ok' })
    } else {
      res.status(500).json({ status: 'error', details: 'Application is down' })
    }
  }
}

import * as dateAndTime from 'date-and-time'
import * as unixTimestamp from 'unix-timestamp'
import { Repository } from './repository'
import { schema as shopSchema } from '../schema/coffee-shop'
import { schema as orderSchema } from '../schema/order'
import { Initializable } from '../types'

export class App implements Initializable {
  private shops: Repository
  private orders: Repository
  private dateTimeFormat: string

  constructor({ logger, dateTimeFormat }) {
    this.dateTimeFormat = dateTimeFormat

    this.shops = new Repository({
      type: 'coffeeShop',
      schema: shopSchema,
      logger
    })

    this.orders = new Repository({
      type: 'order',
      schema: orderSchema,
      logger
    })
  }

  async up() {
    await Promise.all([ this.shops.up(), this.orders.up() ])
  }

  async down() {
    await Promise.all([ this.shops.down(), this.orders.down() ])
  }

  async isHealthy() {
    const shopsHealth = await this.shops.isConnected()
    const ordersHealth = await this.shops.isConnected()

    return shopsHealth && ordersHealth
  }

  listCoffeeShops(query = {}) {
    return this.shops.find(query)
  }

  registerCoffeeShop(data) {
    return this.shops.create(data)
  }

  getCoffeeShop(id: string) {
    return this.shops.get(id)
  }

  updateCoffeeShop(id: string, data) {
    return this.shops.update(id, data)
  }

  deleteCoffeeShop(id: string) {
    return this.shops.delete(id)
  }

  private formatOrder(data) {
    return {
      ...data,
      body: {
        shopId: data.body.shopId,
        arrivalTime: dateAndTime.format(unixTimestamp.toDate(data.body.arrivalTime), this.dateTimeFormat),
        customerName: data.body.customerName,
        details: data.body.details
      }
    }
  }

  async listOrders(shopId: string, query = {}) {
    const orders = await this.orders.find({ ...query, shopId }, 'body.arrivalTime')

    return orders.map(x => this.formatOrder(x))
  }

  async placeOrder(shopId: string, data) {
    const order = await this.orders.create({
      shopId,
      arrivalTime: unixTimestamp.fromDate(dateAndTime.parse(data.arrivalTime, this.dateTimeFormat)),
      customerName: data.customerName,
      details: data.details
    })

    return this.formatOrder(order)
  }

  async getOrder(shopId: string, id: string) {
    const order = await this.orders.get(id)
    if (!order || order.body.shopId !== shopId) {
      return
    }

    return this.formatOrder(order)
  }

  async changeOrder(shopId: string, id: string, data) {
    const currentVersion = await this.orders.get(id)
    if (!currentVersion || currentVersion.body.shopId !== shopId) {
      return
    }

    const newVersion = await this.orders.update(id, data)

    return this.formatOrder(newVersion)
  }

  async deleteOrder(shopId: string, id: string) {
    const order = await this.orders.get(id)
    if (!order || order.body.shopId !== shopId) {
      return
    }

    const lastKnownVersion = await this.orders.delete(id)

    return this.formatOrder(lastKnownVersion)
  }
}

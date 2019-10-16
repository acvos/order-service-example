import { StringMap, StorageInterface } from './types'

export class App {
  private storage: StorageInterface

  constructor({ storage }) {
    this.storage = storage
  }

  listCoffeeShops(query: StringMap) {
    return this.storage.find('coffeeShop', query)
  }

  registerCoffeeShop(data: StringMap) {
    return this.storage.create('coffeeShop', data)
  }

  getCoffeeShop(id: string) {
    return this.storage.get(id)
  }

  async updateCoffeeShop(id: string, data: StringMap) {
    return this.storage.update(id, data)
  }

  deleteCoffeeShop(id: string) {
    return this.storage.delete(id)
  }

  async listOrders(shopId: string, query: StringMap) {
    return this.storage.find('order', { ...query, shopId })
  }

  placeOrder(shopId: string, data: StringMap) {
    return this.storage.create('order', { ...data, shopId })
  }

  async getOrders(shopId: string, id: string) {
    const order = await this.storage.get(id)
    if (!order || order.body.shopId !== shopId) {
      return
    }

    return order
  }

  async changeOrder(shopId: string, id: string, data: StringMap) {
    const order = await this.storage.get(id)
    if (!order || order.body.shopId !== shopId) {
      return
    }

    return this.storage.update(id, data)
  }

  async deleteOrder(shopId: string, id: string) {
    const order = await this.storage.get(id)
    if (!order || order.body.shopId !== shopId) {
      return
    }

    return this.storage.delete(id)
  }
}

import { StringMap } from './types'

export class App {
  private storage

  constructor({ storage }) {
    this.storage = storage
  }

  listCoffeeShops(query: StringMap) {
    return this.storage.find('coffeeShop', {
      ...query,
      isDeleted: false
    })
  }

  registerCoffeeShop(data: StringMap) {
    return this.storage.create('coffeeShop', data)
  }

  async getCoffeeShop(id: string) {
    const coffeeShop = await this.storage.get(id)
    if (coffeeShop.body.isDeleted) {
      return
    }

    return coffeeShop
  }

  async updateCoffeeShop(id: string, data: StringMap) {
    return this.storage.update(id, data)
  }

  async deleteCoffeeShop(id: string) {
    const coffeeShop = await this.storage.get(id)
    if (!coffeeShop || coffeeShop.body.isDeleted) {
      return
    }

    return this.storage.update(id, {
      ...coffeeShop.body,
      isDeleted: true
    })
  }

  async listOrders(shopId: string, query: StringMap) {
    return this.storage.find('order', {
      ...query,
      shopId,
      isDeleted: false
    })
  }

  placeOrder(shopId: string, data: StringMap) {
    return this.storage.create('order', { ...data, shopId })
  }

  async getOrders(shopId: string, id: string) {
    const order = await this.storage.get(id)
    if (order.body.shopId !== shopId || order.body.isDeleted) {
      return
    }

    return order
  }

  async changeOrder(shopId: string, id: string, data: StringMap) {
    const order = await this.storage.get(id)
    if (order.body.shopId !== shopId) {
      return
    }

    return this.storage.update(id, data)
  }

  async deleteOrder(shopId: string, id: string) {
    const order = await this.storage.get(id)
    if (order.body.shopId !== shopId || order.body.isDeleted) {
      return
    }

    return this.storage.update(id, {
      ...order.body,
      isDeleted: true
    })
  }
}

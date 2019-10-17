import * as chai from 'chai'
import { expectEntity } from './assertions'

export const registerCoffeeShop = async (app, name) => {
  const newShop = await app.registerCoffeeShop({ name })
  expectEntity(newShop)
  chai.expect(newShop.type).to.eq('coffeeShop')
  chai.expect(newShop.body.name).to.eq(name)

  const newShopReadBack = await app.getCoffeeShop(newShop.id)
  expectEntity(newShopReadBack)
  chai.expect(newShopReadBack.type).to.eq('coffeeShop')
  chai.expect(newShopReadBack.id).to.eq(newShop.id)
  chai.expect(newShopReadBack.body.name).to.eq(name)

  return newShop.id
}

export const placeOrder = async (app, shopId, { arrivalTime, customerName, details }) => {
  const newOrder = await app.placeOrder(shopId, { arrivalTime, customerName, details })
  expectEntity(newOrder)
  chai.expect(newOrder.type).to.eq('order')
  chai.expect(newOrder.body.details).to.eq(details)
  chai.expect(newOrder.body.arrivalTime).to.eq(arrivalTime)
  chai.expect(newOrder.body.customerName).to.eq(customerName)

  const newOrderReadBack = await app.getOrder(shopId, newOrder.id)
  expectEntity(newOrderReadBack)
  chai.expect(newOrder.body.details).to.eq(details)
  chai.expect(newOrder.body.arrivalTime).to.eq(arrivalTime)
  chai.expect(newOrder.body.customerName).to.eq(customerName)

  const nope = await app.getOrder('random_id', newOrder.id)
  chai.expect(nope).to.be.undefined

  return newOrder.id
}

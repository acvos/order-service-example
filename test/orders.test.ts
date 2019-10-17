import 'mocha'
import * as chai from 'chai'
import { registerCoffeeShop, placeOrder } from './steps'
import { App } from '../src/app'

const app = new App({ logger: console, dateTimeFormat: 'YYYY-MM-DD HH:mm' })
const shopIds = []

before(async () => {
  await app.up()
  shopIds.push(await registerCoffeeShop(app, 'Such'))
  shopIds.push(await registerCoffeeShop(app, 'Much'))
})

describe('Order life-cycle', () => {
  it('should have no orders when started', async () => {
    const res1 = await app.listOrders(shopIds[0])
    chai.expect(res1).to.eql([])

    const res2 = await app.listOrders(shopIds[1])
    chai.expect(res2).to.eql([])
  })

  it('should be able to place orders', async () => {
    await placeOrder(app, shopIds[1], {arrivalTime: '2019-10-17 10:50', customerName: 'doge1', details: 'wow'})
    await placeOrder(app, shopIds[0], {arrivalTime: '2019-10-17 10:20', customerName: 'doge2', details: 'very coffee'})
    await placeOrder(app, shopIds[1], {arrivalTime: '2019-10-17 09:10', customerName: 'doge3', details: 'much tea'})
    await placeOrder(app, shopIds[0], {arrivalTime: '2019-10-17 11:45', customerName: 'doge4', details: 'very coffee'})
    await placeOrder(app, shopIds[1], {arrivalTime: '2019-10-17 08:00', customerName: 'doge5', details: 'much tea'})
  })

  it('should be able to list the orders for coffee-shops', async() => {
    const orders1 = await app.listOrders(shopIds[0])
    chai.expect(orders1).to.be.a('array')
    chai.expect(orders1).to.have.length(2)

    const orders2 = await app.listOrders(shopIds[1])
    chai.expect(orders2).to.be.a('array')
    chai.expect(orders2).to.have.length(3)
  })

  it('order lists are sorted by the arrival time', async() => {
    const orders1 = await app.listOrders(shopIds[0])
    chai.expect(orders1[0].body.customerName).to.eq('doge2')
    chai.expect(orders1[1].body.customerName).to.eq('doge4')

    const orders2 = await app.listOrders(shopIds[1])
    chai.expect(orders2[0].body.customerName).to.eq('doge5')
    chai.expect(orders2[1].body.customerName).to.eq('doge3')
    chai.expect(orders2[2].body.customerName).to.eq('doge1')
  })
})

after(() => app.down())

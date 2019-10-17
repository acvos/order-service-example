import 'mocha'
import * as chai from 'chai'
import { expectEntity } from './assertions'
import { registerCoffeeShop } from './steps'
import { App } from '../src/app'

const app = new App({ logger: console, dateTimeFormat: 'YYYY-MM-DD HH:mm' })

before(() => app.up())

describe('Coffee shop life-cycle', () => {
  it('should have no shops when started', async () => {
    const res = await app.listCoffeeShops()
    chai.expect(res).to.eql([])
  })

  it('should be able to register a new coffee-shops', async () => {
    await registerCoffeeShop(app, 'Doge')
  })

  it('should have one coffee-shop now', async () => {
    const res = await app.listCoffeeShops()
    chai.expect(res).to.be.a('array')
    chai.expect(res).to.have.length(1)

    expectEntity(res[0])
    chai.expect(res[0].body.name).to.eq('Doge')
  })

  it('should be able to register a second coffee-shop', async () => {
    await registerCoffeeShop(app, 'Wow')
  })

  it('should have two coffee-shops now', async () => {
    const res = await app.listCoffeeShops()
    chai.expect(res).to.be.a('array')
    chai.expect(res).to.have.length(2)

    expectEntity(res[0])
    chai.expect(res[0].body.name).to.eq('Doge')

    expectEntity(res[1])
    chai.expect(res[1].body.name).to.eq('Wow')
  })

  it('should be able to find coffee-shop by name', async () => {
    const res = await app.listCoffeeShops({ name: 'Wow' })
    chai.expect(res).to.be.a('array')
    chai.expect(res).to.have.length(1)

    expectEntity(res[0])
    chai.expect(res[0].body.name).to.eq('Wow')
  })

  it('should be able to modify a coffee-shop', async () => {
    const [shop] = await app.listCoffeeShops({ name: 'Wow' })
    const newVersion = await app.updateCoffeeShop(shop.id, { name: 'Such much' })
    expectEntity(newVersion)
    chai.expect(newVersion.type).to.eq('coffeeShop')
    chai.expect(newVersion.body.name).to.eq('Such much')
  })

  it('should still have two coffee-shops', async () => {
    const res = await app.listCoffeeShops()
    chai.expect(res).to.be.a('array')
    chai.expect(res).to.have.length(2)

    expectEntity(res[0])
    chai.expect(res[0].body.name).to.eq('Doge')

    expectEntity(res[1])
    chai.expect(res[1].body.name).to.eq('Such much')
  })

  it('should not see the old coffee-shop version', async () => {
    const res = await app.listCoffeeShops({ name: 'Wow' })
    chai.expect(res).to.eql([])
  })

  it('should be able to delete a coffee-shop', async () => {
    const [shop] = await app.listCoffeeShops({ name: 'Doge' })
    await app.deleteCoffeeShop(shop.id)

    const res = await app.getCoffeeShop(shop.id)
    chai.expect(res).to.be.undefined
  })

  it('should not see the deleted coffee-shop', async () => {
    const res = await app.listCoffeeShops({ name: 'Doge' })
    chai.expect(res).to.eql([])
  })

  it('should have one coffee-shop now', async () => {
    const res = await app.listCoffeeShops()
    chai.expect(res).to.be.a('array')
    chai.expect(res).to.have.length(1)

    expectEntity(res[0])
    chai.expect(res[0].body.name).to.eq('Such much')
  })
})

describe('Coffee shop unhappy path', () => {
  it('should not be able to create coffee-shop without a name', async () => {
    chai.expect(() => app.registerCoffeeShop({})).to.throw()
  })

  it('should not be able to create malformed coffee-shop', async () => {
    chai.expect(() => app.registerCoffeeShop({ doge: 'wow', such: 'much' })).to.throw()
  })
})

after(() => app.down())

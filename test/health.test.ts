import 'mocha'
import * as chai from 'chai'
import { App } from '../src/app'

const app = new App({ logger: console, dateTimeFormat: 'YYYY-MM-DD HH:mm' })

before(() => app.up())

describe('Application status', () => {
  it('should be always healthy', async () => {
    const res = await app.isHealthy()
    chai.expect(res).to.be.true
  })
})

after(() => app.down())

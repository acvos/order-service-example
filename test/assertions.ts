import * as chai from 'chai'

export const expectEntity = (data) => {
  chai.expect(data).to.be.a('object')
  chai.expect(data).to.have.property('body')
  chai.expect(data).to.have.property('schema')
  chai.expect(data).to.have.property('id')
  chai.expect(data).to.have.property('type')
}

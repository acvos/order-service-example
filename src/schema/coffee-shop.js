export const schema = {
  name: 'coffeeShop',
  description: 'Coffee Shop',
  type: 'record',
  fields: [
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'isDeleted',
      type: 'boolean',
      default: false
    }
  ]
}
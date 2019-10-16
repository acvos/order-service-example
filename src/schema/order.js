export const schema = {
  name: 'order',
  description: 'Order',
  type: 'record',
  fields: [
    {
      name: 'shopId',
      type: 'string'
    },
    {
      name: 'arrivalTime',
      type: 'int'
    },
    {
      name: 'customerName',
      type: 'string'
    },
    {
      name: 'details',
      type: 'string'
    },
    {
      name: 'isDeleted',
      type: 'boolean',
      default: false
    }
  ]
}
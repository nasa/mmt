import { removeEmpty, removeNulls } from '../json_utils'

describe('json utils tests', () => {
  it('removes empty values {}', async () => {
    const obj = {
      alpha: [],
      beta: {},
      gamma: [{}],
      delta: { foo: 'x', bar: {} },
      epsilon: { foo: 'x', bar: [{}], zee: '' }
    }
    const newObj = removeEmpty(obj)
    expect(newObj).toEqual({ delta: { foo: 'x' }, epsilon: { foo: 'x' } })
  })

  it('removes nulls', async () => {
    const obj = {
      store: {
        book: [
          null,
          {
            category: 'fiction',
            author: 'Evelyn Waugh',
            title: 'Sword of Honour',
            price: 12.99
          },
          null,
          {
            category: 'fiction',
            author: 'J. R. R. Tolkien',
            title: 'The Lord of the Rings'
          }
        ],
        bicycle: {
          color: 'red',
          price: null
        }
      }
    }
    const newObj = removeNulls(obj)
    expect(newObj).toEqual(
      {
        store: {
          book: [{
            category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99
          }, { category: 'fiction', author: 'J. R. R. Tolkien', title: 'The Lord of the Rings' }],
          bicycle: { color: 'red' }
        }
      }
    )
  })
})

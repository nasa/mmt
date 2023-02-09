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
      alpha: null,
      beta: { },
      gamma: [{}, null],
      delta: { foo: 'x', bar: { zee: null } },
      epsilon: { foo: 'x', bar: [{ zee: null }, null] }
    }
    const newObj = removeNulls(obj)
    expect(newObj).toEqual({
      beta: {},
      gamma: [{}],
      delta: { foo: 'x', bar: {} },
      epsilon: { foo: 'x', bar: [{}] }
    })
  })
})

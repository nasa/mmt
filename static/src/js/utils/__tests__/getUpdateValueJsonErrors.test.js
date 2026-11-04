import getUpdateValueJsonErrors from '../getUpdateValueJsonErrors'
import buildUpdateValueJsonSchema from '../buildUpdateValueJsonSchema'

describe('getUpdateValueJsonErrors', () => {
  const fields = [
    {
      key: 'ShortName',
      type: 'text'
    },
    {
      key: 'NumberOfInstruments',
      type: 'number'
    },
    {
      key: 'Roles',
      type: 'select',
      options: ['ARCHIVER', 'DISTRIBUTOR']
    }
  ]

  test('returns an Invalid JSON message when the text does not parse', () => {
    const schema = buildUpdateValueJsonSchema(fields, false)

    expect(getUpdateValueJsonErrors('{not valid json', schema)).toEqual([
      expect.stringContaining('Invalid JSON:')
    ])
  })

  test('returns no errors for valid JSON that satisfies the schema', () => {
    const schema = buildUpdateValueJsonSchema(fields, false)
    const text = JSON.stringify({
      ShortName: 'NASA/GSFC',
      NumberOfInstruments: 2,
      Roles: 'ARCHIVER'
    })

    expect(getUpdateValueJsonErrors(text, schema)).toEqual([])
  })

  test('flags a type mismatch, e.g. a string where a number is expected', () => {
    const schema = buildUpdateValueJsonSchema(fields, false)
    const text = JSON.stringify({ NumberOfInstruments: 'five' })

    expect(getUpdateValueJsonErrors(text, schema).length).toBeGreaterThan(0)
  })

  test('flags an enum violation', () => {
    const schema = buildUpdateValueJsonSchema(fields, false)
    const text = JSON.stringify({ Roles: 'NOT_A_REAL_ROLE' })

    expect(getUpdateValueJsonErrors(text, schema).length).toBeGreaterThan(0)
  })

  test('flags an unknown key with a readable message', () => {
    const schema = buildUpdateValueJsonSchema(fields, false)
    const text = JSON.stringify({ NotARealField: 'value' })

    expect(getUpdateValueJsonErrors(text, schema)).toEqual([
      "must NOT have additional property 'NotARealField'"
    ])
  })

  test('accepts a single entry object when allowMultiple is true', () => {
    const schema = buildUpdateValueJsonSchema(fields, true)
    const text = JSON.stringify({ ShortName: 'NASA/GSFC' })

    expect(getUpdateValueJsonErrors(text, schema)).toEqual([])
  })

  test('accepts an array of entries when allowMultiple is true', () => {
    const schema = buildUpdateValueJsonSchema(fields, true)
    const text = JSON.stringify([{ ShortName: 'NASA/GSFC' }, { ShortName: 'NASA/JPL' }])

    expect(getUpdateValueJsonErrors(text, schema)).toEqual([])
  })

  describe('when allowMultiple is true (a oneOf schema)', () => {
    test('reports only the real error for a single-entry mistake, not the oneOf/array noise', () => {
      const schema = buildUpdateValueJsonSchema(fields, true)
      const text = JSON.stringify({ NumberOfInstruments: 'five' })

      expect(getUpdateValueJsonErrors(text, schema)).toEqual([
        '.NumberOfInstruments must be integer'
      ])
    })

    test('reports only the real error for a mistake inside an array entry, not the oneOf/object noise', () => {
      const schema = buildUpdateValueJsonSchema(fields, true)
      const text = JSON.stringify([{ ShortName: 'ok' }, { NotARealField: 'x' }])

      expect(getUpdateValueJsonErrors(text, schema)).toEqual([
        ".1 must NOT have additional property 'NotARealField'"
      ])
    })

    test('reports a single message when the value is neither an object nor an array', () => {
      const schema = buildUpdateValueJsonSchema(fields, true)

      expect(getUpdateValueJsonErrors('42', schema)).toEqual(['must be object'])
    })
  })
})

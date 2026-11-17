import buildUpdateValueJsonSchema from '../buildUpdateValueJsonSchema'
import getUpdateValueJsonErrors from '../getUpdateValueJsonErrors'

describe('buildUpdateValueJsonSchema', () => {
  test('builds an object schema for text fields', () => {
    const fields = [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      }
    ]

    expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
      type: 'object',
      properties: {
        ShortName: { type: ['string', 'null'] },
        LongName: { type: ['string', 'null'] }
      },
      additionalProperties: false
    })
  })

  test('builds an integer schema for a number field', () => {
    const fields = [
      {
        key: 'NumberOfInstruments',
        type: 'number'
      }
    ]

    expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
      type: 'object',
      properties: {
        NumberOfInstruments: { type: ['integer', 'null'] }
      },
      additionalProperties: false
    })
  })

  test('builds an enum schema for a select field', () => {
    const fields = [
      {
        key: 'DataType',
        type: 'select',
        options: ['STRING', 'INT']
      }
    ]

    expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
      type: 'object',
      properties: {
        DataType: {
          type: ['string', 'null'],
          enum: ['STRING', 'INT', null]
        }
      },
      additionalProperties: false
    })
  })

  test('builds an array-of-enum schema for a multiselect field', () => {
    const fields = [
      {
        key: 'Roles',
        type: 'multiselect',
        options: ['ARCHIVER', 'DISTRIBUTOR']
      }
    ]

    expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
      type: 'object',
      properties: {
        Roles: {
          type: ['array', 'null'],
          items: {
            type: 'string',
            enum: ['ARCHIVER', 'DISTRIBUTOR']
          }
        }
      },
      additionalProperties: false
    })
  })

  test('builds a nested object schema for a nested-array field', () => {
    const fields = [
      {
        key: 'Characteristics',
        type: 'nested-array',
        fields: [
          {
            key: 'Name',
            type: 'text'
          },
          {
            key: 'DataType',
            type: 'select',
            options: ['STRING', 'INT']
          }
        ]
      }
    ]

    expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
      type: 'object',
      properties: {
        Characteristics: {
          type: ['array', 'null'],
          items: {
            type: 'object',
            properties: {
              Name: { type: ['string', 'null'] },
              DataType: {
                type: ['string', 'null'],
                enum: ['STRING', 'INT', null]
              }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    })
  })

  describe('an ummRequired field (e.g. Data Centers\' Roles)', () => {
    const fields = [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'Roles',
        type: 'multiselect',
        options: ['ARCHIVER', 'DISTRIBUTOR'],
        ummRequired: true
      }
    ]

    test('is required, with at least one item, when allowMultiple is true', () => {
      expect(buildUpdateValueJsonSchema(fields, true)).toEqual({
        oneOf: [
          {
            type: 'object',
            properties: {
              ShortName: { type: ['string', 'null'] },
              Roles: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['ARCHIVER', 'DISTRIBUTOR']
                },
                minItems: 1
              }
            },
            additionalProperties: false,
            required: ['Roles']
          },
          {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                ShortName: { type: ['string', 'null'] },
                Roles: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['ARCHIVER', 'DISTRIBUTOR']
                  },
                  minItems: 1
                }
              },
              additionalProperties: false,
              required: ['Roles']
            }
          }
        ]
      })
    })

    // Required also strips `null` from the field's own `type` (and `enum`, for a `select`
    // field) -- without that, an explicit null on a required field satisfies `required` (the
    // key is present) and still matches the nullable type, silently bypassing it.
    test('rejects an explicit null for the required field, unlike a non-required one', () => {
      const value = JSON.stringify({
        ShortName: null,
        Roles: null
      })
      const schema = buildUpdateValueJsonSchema(fields, true)

      const errors = getUpdateValueJsonErrors(value, schema)

      expect(errors.some((error) => error.includes('Roles'))).toBe(true)
    })

    test('accepts an explicit null for a non-required field', () => {
      const value = JSON.stringify({
        ShortName: null,
        Roles: ['ARCHIVER']
      })
      const schema = buildUpdateValueJsonSchema(fields, true)

      expect(getUpdateValueJsonErrors(value, schema)).toEqual([])
    })

    test('under a partial-merge action type (allowMultiple false), still rejects an explicit null for the required field but accepts it blank/untouched', () => {
      const schema = buildUpdateValueJsonSchema(fields, false)

      // Null means "actively remove it" -- CMR would reject a matched entry left without a
      // field it requires, same as it would for a replacing action type.
      const nulledValue = JSON.stringify({
        ShortName: 'ASF',
        Roles: null
      })
      expect(getUpdateValueJsonErrors(nulledValue, schema)).not.toEqual([])

      // Blank/missing means "don't touch it" -- the existing entry already has a valid
      // value, and stripUnfilledUpdateValueFields drops it before submission anyway.
      const blankValue = JSON.stringify({
        ShortName: 'ASF',
        Roles: []
      })
      expect(getUpdateValueJsonErrors(blankValue, schema)).toEqual([])

      const untouchedValue = JSON.stringify({ ShortName: 'ASF' })
      expect(getUpdateValueJsonErrors(untouchedValue, schema)).toEqual([])
    })

    test('rejects a blank string for a required text field, unlike a non-required one', () => {
      // `required` only checks the key is present, and `type: 'string'` matches '' too, so
      // without minLength:1 an untouched ShortName skeleton default ('') would silently pass.
      const textFields = [
        {
          key: 'ShortName',
          type: 'text',
          ummRequired: true
        },
        {
          key: 'LongName',
          type: 'text'
        }
      ]

      const schema = buildUpdateValueJsonSchema(textFields, true)

      const requiredBlank = JSON.stringify({
        ShortName: '',
        LongName: 'Foo'
      })
      expect(getUpdateValueJsonErrors(requiredBlank, schema)).not.toEqual([])

      const nonRequiredBlank = JSON.stringify({
        ShortName: 'ASF',
        LongName: ''
      })
      expect(getUpdateValueJsonErrors(nonRequiredBlank, schema)).toEqual([])
    })

    test('also strips null from a required select field\'s enum', () => {
      const selectFields = [
        {
          key: 'DataType',
          type: 'select',
          options: ['STRING', 'INT'],
          ummRequired: true
        }
      ]

      const { oneOf: [entrySchema] } = buildUpdateValueJsonSchema(selectFields, true)

      expect(entrySchema.properties.DataType).toEqual({
        type: 'string',
        enum: ['STRING', 'INT'],
        minLength: 1
      })
    })

    test('is not required when allowMultiple is false (a partial-merge action type), but still rejects null', () => {
      expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
        type: 'object',
        properties: {
          ShortName: { type: ['string', 'null'] },
          // Not required (no `required` array, no minItems) -- a blank/untouched Roles is
          // fine under FIND_AND_UPDATE. Still non-nullable, though: an explicit null would
          // leave the matched entry without a field CMR requires it to have, same as for a
          // replacing action type.
          Roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['ARCHIVER', 'DISTRIBUTOR']
            }
          }
        },
        additionalProperties: false
      })
    })
  })

  test('accepts either a single entry or an array of entries when allowMultiple is true', () => {
    const fields = [{
      key: 'ShortName',
      type: 'text'
    }]

    const entrySchema = {
      type: 'object',
      properties: {
        ShortName: { type: ['string', 'null'] }
      },
      additionalProperties: false
    }

    expect(buildUpdateValueJsonSchema(fields, true)).toEqual({
      oneOf: [
        entrySchema,
        {
          type: 'array',
          items: entrySchema
        }
      ]
    })
  })
})

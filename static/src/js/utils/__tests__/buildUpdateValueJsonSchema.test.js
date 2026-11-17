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

  describe('a requiredWhenReplacing field (e.g. Data Centers\' Roles)', () => {
    const fields = [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'Roles',
        type: 'multiselect',
        options: ['ARCHIVER', 'DISTRIBUTOR'],
        requiredWhenReplacing: true
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

    test('also strips null from a required select field\'s enum', () => {
      const selectFields = [
        {
          key: 'DataType',
          type: 'select',
          options: ['STRING', 'INT'],
          requiredWhenReplacing: true
        }
      ]

      const { oneOf: [entrySchema] } = buildUpdateValueJsonSchema(selectFields, true)

      expect(entrySchema.properties.DataType).toEqual({
        type: 'string',
        enum: ['STRING', 'INT']
      })
    })

    test('is not required when allowMultiple is false (a partial-merge action type)', () => {
      expect(buildUpdateValueJsonSchema(fields, false)).toEqual({
        type: 'object',
        properties: {
          ShortName: { type: ['string', 'null'] },
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

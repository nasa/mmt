import buildUpdateValueJsonSchema from '../buildUpdateValueJsonSchema'

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
        ShortName: { type: 'string' },
        LongName: { type: 'string' }
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
        NumberOfInstruments: { type: 'integer' }
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
          type: 'string',
          enum: ['STRING', 'INT']
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
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Name: { type: 'string' },
              DataType: {
                type: 'string',
                enum: ['STRING', 'INT']
              }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
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
        ShortName: { type: 'string' }
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

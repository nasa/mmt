import buildUpdateValueJsonSkeleton from '../buildUpdateValueJsonSkeleton'

describe('buildUpdateValueJsonSkeleton', () => {
  test('builds a single object with every key defaulted to an empty string', () => {
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

    expect(buildUpdateValueJsonSkeleton(fields, false)).toEqual(
      JSON.stringify({
        ShortName: '',
        LongName: ''
      }, null, 2)
    )
  })

  test('defaults multiselect and nested-array fields to an empty array', () => {
    const fields = [
      {
        key: 'Roles',
        type: 'multiselect',
        options: ['ARCHIVER', 'DISTRIBUTOR']
      },
      {
        key: 'Characteristics',
        type: 'nested-array',
        fields: [{
          key: 'Name',
          type: 'text'
        }]
      }
    ]

    expect(buildUpdateValueJsonSkeleton(fields, false)).toEqual(
      JSON.stringify({
        Roles: [],
        Characteristics: []
      }, null, 2)
    )
  })

  test('defaults a number field to 0, not a quoted string', () => {
    const fields = [
      {
        key: 'NumberOfInstruments',
        type: 'number'
      }
    ]

    expect(buildUpdateValueJsonSkeleton(fields, false)).toEqual(
      JSON.stringify({ NumberOfInstruments: 0 }, null, 2)
    )
  })

  test('wraps the entry in an array when allowMultiple is true', () => {
    const fields = [{
      key: 'ShortName',
      type: 'text'
    }]

    expect(buildUpdateValueJsonSkeleton(fields, true)).toEqual(
      JSON.stringify([{ ShortName: '' }], null, 2)
    )
  })
})

import stripUnfilledUpdateValueFields from '../stripUnfilledUpdateValueFields'

describe('stripUnfilledUpdateValueFields', () => {
  test('drops a key whose value is an empty string', () => {
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'ASF',
      LongName: ''
    })).toEqual({ ShortName: 'ASF' })
  })

  test('keeps a key whose value is 0, since that is a real value a user might submit, not the unfilled skeleton default', () => {
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'ATM',
      NumberOfInstruments: 0
    })).toEqual({
      ShortName: 'ATM',
      NumberOfInstruments: 0
    })
  })

  test('drops a key whose value is an empty array', () => {
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'A340-600',
      Characteristics: []
    })).toEqual({ ShortName: 'A340-600' })
  })

  test('keeps a key explicitly set to null, since that means "remove this field"', () => {
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'ASF',
      LongName: null
    })).toEqual({
      ShortName: 'ASF',
      LongName: null
    })
  })

  test('keeps a non-empty value, including a real 0-length-adjacent value like a single space', () => {
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'ASF',
      LongName: ' '
    })).toEqual({
      ShortName: 'ASF',
      LongName: ' '
    })
  })

  test('strips every entry in an array updateValue independently', () => {
    expect(stripUnfilledUpdateValueFields([
      {
        ShortName: 'ASF',
        LongName: ''
      },
      {
        ShortName: 'LARC',
        LongName: 'Langley Research Center'
      }
    ])).toEqual([
      { ShortName: 'ASF' },
      {
        ShortName: 'LARC',
        LongName: 'Langley Research Center'
      }
    ])
  })

  test('drops an array entry entirely once stripping leaves it with no keys', () => {
    expect(stripUnfilledUpdateValueFields([
      {
        ShortName: 'ASF',
        LongName: 'Alaska Satellite Facility'
      },
      {
        ShortName: '',
        LongName: ''
      }
    ])).toEqual([
      {
        ShortName: 'ASF',
        LongName: 'Alaska Satellite Facility'
      }
    ])
  })

  test('recurses into a nested array of objects (e.g. a hand-added Characteristics entry)', () => {
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'A340-600',
      Characteristics: [
        {
          Name: 'Wingspan',
          Description: '',
          Value: '63.45',
          Unit: ''
        }
      ]
    })).toEqual({
      ShortName: 'A340-600',
      Characteristics: [
        {
          Name: 'Wingspan',
          Value: '63.45'
        }
      ]
    })
  })

  test('drops a nested array key once every one of its entries strips down to nothing', () => {
    // Characteristics' own blank skeleton placeholder -- never hand-filled -- strips down to
    // an empty array; the key itself must then be dropped too, not left behind as `[]`.
    expect(stripUnfilledUpdateValueFields({
      ShortName: 'A340-600',
      Characteristics: [
        {
          Name: '',
          Description: '',
          Value: '',
          Unit: ''
        }
      ]
    })).toEqual({ ShortName: 'A340-600' })
  })

  test('leaves non-object updateValue (e.g. a string) untouched', () => {
    expect(stripUnfilledUpdateValueFields('NASA/GSFC')).toBe('NASA/GSFC')
  })
})

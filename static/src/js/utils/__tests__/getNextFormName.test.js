import getNextFormName from '../getNextFormName'

const formConfiguration = [
  { displayName: 'Tool Information' },
  { displayName: 'Related URLs' },
  { displayName: 'Compatibility And Usability' },
  { displayName: 'Descriptive Keywords' },
  { displayName: 'Tool Organizations' }
]

describe('getNextFormName', () => {
  describe('When current form is first the form list', () => {
    test('returns second form name', () => {
      const currentForm = 'tool-information'

      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Related URLs')
    })
  })

  describe('When current form is in the form list', () => {
    test('returns next form name', () => {
      const currentForm = 'related-ur-ls'

      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Compatibility And Usability')
    })
  })

  describe('When current form is last in the form list', () => {
    test('returns first form name', () => {
      const currentForm = 'tool-organizations'

      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Tool Information')
    })
  })

  describe('When current form is not in the form list', () => {
    test('returns first form name', () => {
      const currentForm = 'abc'

      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Tool Information')
    })
  })
})

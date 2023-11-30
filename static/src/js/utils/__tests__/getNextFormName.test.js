import getNextFormName from '../getNextFormName'

describe('getNextFormName', () => {
  const formConfiguration = [
    { displayName: 'Tool Information' },
    { displayName: 'Related URLs' },
    { displayName: 'Compatibility And Usability' },
    { displayName: 'Descriptive Keywords' },
    { displayName: 'Tool Organizations' }
  ]

  describe('When current form is first the form list', () => {
    const currentForm = 'tool-information'
    test('returns second form name', () => {
      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Related URLs')
    })
  })

  describe('When current form is in the form list', () => {
    const currentForm = 'related-ur-ls'
    test('returns next form name', () => {
      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Compatibility And Usability')
    })
  })

  describe('When current form is last in the form list', () => {
    const currentForm = 'tool-organizations'
    test('returns first form name', () => {
      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Tool Information')
    })
  })

  describe('When current form is not in the form list', () => {
    const currentForm = 'abc'
    test('returns first form name', () => {
      expect(getNextFormName(formConfiguration, currentForm)).toEqual('Tool Information')
    })
  })
})

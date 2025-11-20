import { validateProposal } from '../validateProposal'

describe('validateProposal', () => {
  describe('When all mandatory fields are present', () => {
    test('should return isValid true and an empty missingFields array', () => {
      const proposal = {
        id: '123',
        providerId: 'provider1',
        shortName: 'Short Name',
        entryTitle: 'Entry Title',
        proposalStatus: 'Draft',
        requestType: 'Create',
        submitterId: 'submitter1',
        updatedAt: '2023-04-20T12:00:00Z',
        draft: {}
      }

      const result = validateProposal(proposal)

      expect(result).toEqual({
        isValid: true,
        missingFields: []
      })
    })

    test('should ignore extra fields in the proposal', () => {
      const proposal = {
        id: '123',
        providerId: 'provider1',
        shortName: 'Short Name',
        entryTitle: 'Entry Title',
        proposalStatus: 'Draft',
        requestType: 'Create',
        submitterId: 'submitter1',
        updatedAt: '2023-04-20T12:00:00Z',
        draft: { someKey: 'someValue' },
        extraField1: 'Extra',
        extraField2: 123
      }

      const result = validateProposal(proposal)

      expect(result).toEqual({
        isValid: true,
        missingFields: []
      })
    })
  })

  describe('When some mandatory fields are missing', () => {
    test('should return isValid false and list the missing fields', () => {
      const proposal = {
        id: '123',
        providerId: 'provider1',
        shortName: 'Short Name',
        entryTitle: 'Entry Title',
        // Missing proposalStatus
        requestType: 'Create',
        // Missing submitterId
        updatedAt: '2023-04-20T12:00:00Z',
        draft: {}
      }

      const result = validateProposal(proposal)

      expect(result).toEqual({
        isValid: false,
        missingFields: ['proposalStatus', 'submitterId']
      })
    })
  })

  describe('When the proposal is empty', () => {
    test('should return isValid false and list all mandatory fields as missing', () => {
      const proposal = {}

      const result = validateProposal(proposal)

      expect(result).toEqual({
        isValid: false,
        missingFields: [
          'id',
          'providerId',
          'shortName',
          'entryTitle',
          'proposalStatus',
          'requestType',
          'submitterId',
          'updatedAt',
          'draft'
        ]
      })
    })
  })
})

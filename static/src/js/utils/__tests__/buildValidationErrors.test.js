import buildValidationErrors from '../buildValidationErrors'
import createPath from '../createPath'

describe('buildValidationErrors', () => {
  describe('when the validation error is at the top level', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: 'Name',
        message: "must have required property 'Name'",
        params: {
          missingProperty: 'Name'
        },
        stack: "must have required property 'Name'",
        schemaPath: '#/required'
      }

      const result = buildValidationErrors({
        draft: {},
        pathParts: createPath(validationError.property).split('.'),
        validationError
      })

      expect(result).toEqual([{
        message: "must have required property 'Name'",
        name: 'required',
        params: { missingProperty: 'Name' },
        property: 'Name',
        schemaPath: '#/required',
        stack: "must have required property 'Name'"
      }])
    })
  })

  describe('when an error already exists', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: 'LongName',
        message: "must have required property 'LongName'",
        params: {
          missingProperty: 'LongName'
        },
        stack: "must have required property 'LongName'",
        schemaPath: '#/required'
      }

      const result = buildValidationErrors({
        draft: {},
        errors: [{
          message: "must have required property 'Name'",
          name: 'required',
          params: { missingProperty: 'Name' },
          property: 'Name',
          schemaPath: '#/required',
          stack: "must have required property 'Name'"
        }],
        pathParts: createPath(validationError.property).split('.'),
        validationError
      })

      expect(result).toEqual([{
        message: "must have required property 'Name'",
        name: 'required',
        params: { missingProperty: 'Name' },
        property: 'Name',
        schemaPath: '#/required',
        stack: "must have required property 'Name'"
      }, {
        message: "must have required property 'LongName'",
        name: 'required',
        params: { missingProperty: 'LongName' },
        property: 'LongName',
        schemaPath: '#/required',
        stack: "must have required property 'LongName'"
      }])
    })
  })

  describe('when the validation error is in an object field', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: '.URL.Type',
        message: "must have required property ' Type'",
        params: {
          missingProperty: 'Type'
        },
        stack: "must have required property ' Type'",
        schemaPath: '#/properties/URL/required'
      }

      const result = buildValidationErrors({
        draft: {},
        pathParts: createPath(validationError.property).split('.').filter(Boolean),
        validationError
      })

      expect(result).toEqual([{
        errors: [{
          name: 'required',
          property: '.URL.Type',
          message: "must have required property ' Type'",
          params: {
            missingProperty: 'Type'
          },
          stack: "must have required property ' Type'",
          schemaPath: '#/properties/URL/required'
        }],
        fieldName: 'URL'
      }])
    })
  })

  describe('when the validation error is nested within an array', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: '.ContactGroups.0.GroupName',
        message: "must have required property 'GroupName'",
        params: {
          missingProperty: 'GroupName'
        },
        stack: "must have required property 'GroupName'",
        schemaPath: '#/properties/ContactGroups/items/required'
      }

      const result = buildValidationErrors({
        draft: {},
        pathParts: createPath(validationError.property).split('.').filter(Boolean),
        validationError
      })

      expect(result).toEqual([{
        errors: [{
          message: "must have required property 'GroupName'",
          name: 'required',
          params: { missingProperty: 'GroupName' },
          property: '.ContactGroups.0.GroupName',
          schemaPath: '#/properties/ContactGroups/items/required',
          stack: "must have required property 'GroupName'"
        }],
        fieldName: 'ContactGroups (1 of 1)'
      }])
    })
  })

  describe('when the validation error is nested within multiple arrays and objects', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: '.ContactGroups.0.ContactInformation.ContactMechanisms.0.Value',
        message: "must have required property 'Value'",
        params: {
          missingProperty: 'Value'
        },
        stack: "must have required property 'Value'",
        schemaPath: '#/properties/ContactGroups/items/properties/ContactInformation/properties/ContactMechanisms/items/required'
      }

      const result = buildValidationErrors({
        draft: {},
        pathParts: createPath(validationError.property).split('.').filter(Boolean),
        validationError
      })

      expect(result).toEqual([{
        errors: [{
          errors: [{
            errors: [{
              message: "must have required property 'Value'",
              name: 'required',
              params: {
                missingProperty: 'Value'
              },
              property: '.ContactGroups.0.ContactInformation.ContactMechanisms.0.Value',
              schemaPath: '#/properties/ContactGroups/items/properties/ContactInformation/properties/ContactMechanisms/items/required',
              stack: "must have required property 'Value'"
            }],
            fieldName: 'ContactMechanisms (1 of 1)'
          }],
          fieldName: 'ContactInformation'
        }],
        fieldName: 'ContactGroups (1 of 1)'
      }])
    })
  })

  describe('when an error already exists for an object field', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: '.URL.Type',
        message: "must have required property ' Type'",
        params: {
          missingProperty: 'Type'
        },
        stack: "must have required property ' Type'",
        schemaPath: '#/properties/URL/required'
      }

      const result = buildValidationErrors({
        draft: {},
        errors: [{
          errors: [{
            name: 'required',
            property: '.URL.URLValue',
            message: "must have required property 'URL Value'",
            params: {
              missingProperty: 'URLValue'
            },
            stack: "must have required property 'URL Value'",
            schemaPath: '#/properties/URL/required'
          }],
          fieldName: 'URL'
        }],
        pathParts: createPath(validationError.property).split('.').filter(Boolean),
        validationError
      })

      expect(result).toEqual([{
        errors: [{
          name: 'required',
          property: '.URL.URLValue',
          message: "must have required property 'URL Value'",
          params: {
            missingProperty: 'URLValue'
          },
          stack: "must have required property 'URL Value'",
          schemaPath: '#/properties/URL/required'
        }, {
          name: 'required',
          property: '.URL.Type',
          message: "must have required property ' Type'",
          params: {
            missingProperty: 'Type'
          },
          stack: "must have required property ' Type'",
          schemaPath: '#/properties/URL/required'
        }],
        fieldName: 'URL'
      }])
    })
  })

  describe('when an error already exists for an array field', () => {
    test('returns the correct errors object', () => {
      const validationError = {
        name: 'required',
        property: '.RelatedURLs.1.Type',
        message: "must have required property 'Type'",
        params: {
          missingProperty: 'Type'
        },
        stack: "must have required property 'Type'",
        schemaPath: '#/properties/RelatedURLs/items/required'
      }

      const result = buildValidationErrors({
        draft: {
          RelatedURLs: [
            {
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION'
            },
            {
              URL: 'asdf',
              URLContentType: 'DataCenterURL'
            }
          ]
        },
        errors: [{
          errors: [{
            name: 'enum',
            property: '.RelatedURLs.0.Type',
            message: 'must be equal to one of the allowed values',
            params: {
              allowedValues: [
                'HOME PAGE'
              ]
            },
            stack: '.RelatedURLs.0.Type must be equal to one of the allowed values',
            schemaPath: '#/properties/RelatedURLs/items/properties/Type/enum'
          }],
          fieldName: 'RelatedURLs (1 of 2)'
        }],
        pathParts: createPath(validationError.property).split('.').filter(Boolean),
        validationError
      })

      expect(result).toEqual([{
        errors: [{
          message: 'must be equal to one of the allowed values',
          name: 'enum',
          params: { allowedValues: ['HOME PAGE'] },
          property: '.RelatedURLs.0.Type',
          schemaPath: '#/properties/RelatedURLs/items/properties/Type/enum',
          stack: '.RelatedURLs.0.Type must be equal to one of the allowed values'
        }],
        fieldName: 'RelatedURLs (1 of 2)'
      }, {
        errors: [{
          message: "must have required property 'Type'",
          name: 'required',
          params: { missingProperty: 'Type' },
          property: '.RelatedURLs.1.Type',
          schemaPath: '#/properties/RelatedURLs/items/required',
          stack: "must have required property 'Type'"
        }],
        fieldName: 'RelatedURLs (2 of 2)'
      }])
    })
  })
})

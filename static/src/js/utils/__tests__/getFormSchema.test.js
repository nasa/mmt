import getFormSchema from '../getFormSchema'

describe('getFormSchema', () => {
  describe('When form name is on the list of form configurations', () => {
    test('returns form schema', () => {
      const fullSchema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: '123456',
        required: [
          'Name',
          'LongName',
          'Type',
          'Version',
          'Description',
          'ToolKeywords',
          'Organizations',
          'URL',
          'MetadataSpecification'
        ],
        definitions: {
          AccessConstraintsType: {},
          AncillaryKeywordsType: {}
        },
        properties: {
          AccessConstraints: {},
          AncillaryKeywords: {},
          ContactGroups: {},
          ContactPersons: {},
          ToolKeywords: {},
          Type: {}
        }
      }
      const formConfigurations = [
        { displayName: 'Tool Information' },
        { displayName: 'Related URLs' },
        { displayName: 'Compatibility And Usability' },
        {
          displayName: 'Descriptive Keywords',
          properties: ['ToolKeywords', 'AncillaryKeywords']
        },
        { displayName: 'Tool Organizations' },
        { displayName: 'Tool Contacts' }
      ]
      const formName = 'descriptive-keywords'

      const formSchema = getFormSchema({
        fullSchema,
        formConfigurations,
        formName
      })

      expect(formSchema.$id).toEqual('123456')
      expect(formSchema.$schema).toEqual('http://json-schema.org/draft-07/schema#')

      expect(formSchema.definitions.AccessConstraintsType).toBeDefined()
      expect(formSchema.definitions.AncillaryKeywordsType).toBeDefined()

      expect(formSchema.required[0]).toEqual('ToolKeywords')

      expect(formSchema.properties.ToolKeywords).toBeDefined()
      expect(formSchema.properties.AncillaryKeywords).toBeDefined()
    })
  })
})

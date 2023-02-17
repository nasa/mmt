import MetadataEditor from '../MetadataEditor'
import UmmToolsModel from '../model/UmmToolsModel'

describe('Metadata Editor', () => {
  describe('UMM Tools Model', () => {
    let model
    let editor
    beforeEach(() => {
      model = new UmmToolsModel()
      editor = new MetadataEditor(model)
    })

    it('starts with first section', async () => {
      // Verify by default we are on Tool Information
      expect(editor.currentSection.displayName).toEqual('Tool Information')
      expect(editor.fullSchema.properties.Name).toBeTruthy()
      expect(editor.formSchema.properties.Name).toBeTruthy()
      expect(editor.formSchema.properties.RelatedURLs).toBeUndefined()
    })

    it('it switches to the second section which is Related URLs', async () => {
      // Switch to Related URLs
      editor.navigateTo(editor.formSections[1])
      expect(editor.currentSection.displayName).toEqual('Related URLs')
      expect(editor.formSchema.properties.Name).toBeUndefined()
      expect(editor.formSchema.properties.RelatedURLs).toBeTruthy()
    })

    it('can save form errors', async () => {
      expect(editor.currentSection.displayName).toEqual('Tool Information')
      editor.formErrors = [
        {
          property: '.ToolKeywords',
          stack: '.ToolKeywords is a required property'
        },
        {
          property: '.MetadataSpecification',
          stack: '.MetadataSpecification is a required property'
        }]
      expect(editor.formErrors[1].property).toEqual('.MetadataSpecification')
    })

    it('can save full errors', async () => {
      expect(editor.currentSection.displayName).toEqual('Tool Information')
      editor.fullErrors = [
        {
          property: '.ToolKeywords',
          stack: '.ToolKeywords is a required property'
        },
        {
          property: '.MetadataSpecification',
          stack: '.MetadataSpecification is a required property'
        }]
      expect(editor.fullErrors[1].property).toEqual('.MetadataSpecification')
    })

    it('can save full data', async () => {
      expect(editor.currentSection.displayName).toEqual('Tool Information')
      editor.formData = { Name: 'My Tool Name' }
      expect(editor.formData.Name).toEqual('My Tool Name')
    })

    it('can save form data and propogate to full data', async () => {
      expect(editor.currentSection.displayName).toEqual('Tool Information')
      editor.formData = { Name: 'My Tool Name' }
      expect(editor.formData.Name).toEqual('My Tool Name')
      expect(editor.fullData.Name).toEqual('My Tool Name')
    })

    it('returns the ui schema for tool information', async () => {
      expect(editor.currentSection.displayName).toEqual('Tool Information')
      expect(editor.uiSchema.LongName['ui:title']).toEqual('Long Name')
    })

    it('returns empty ui schema a unknown section', async () => {
      editor.navigateTo({ displayName: 'Unknown Section' })
      expect(editor.uiSchema).toEqual({
        'ui:submitButtonOptions': {
          norender: true,
          submitText: 'Save'
        }
      })
    })
  })
})

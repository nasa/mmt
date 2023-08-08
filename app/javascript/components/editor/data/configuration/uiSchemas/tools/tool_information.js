import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import urltypes from '../../kms/urltype_tool'

const toolInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Name'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['LongName'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Version'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['VersionDescription'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Type'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['LastUpdatedDate'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['Description'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['DOI'] } }
              ]
            },
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['URL'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  VersionDescription: {
    'ui:widget': 'textarea'
  },
  Description: {
    'ui:widget': 'textarea'
  },
  Type: {
    'ui:widget': CustomSelectWidget
  },
  URL: {
    'ui:root': 'URL',
    'ui:field': 'layout',
    'ui:controlled': {
      keywords: urltypes,
      map: {
        URLContentType: 'url_content_type',
        Type: 'type',
        Subtype: 'subtype'
      }
    },
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:group': 'URL',
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['Description'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { controlName: 'url_content_type', md: 12, children: ['URLContentType'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { controlName: 'type', md: 12, children: ['Type'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { controlName: 'subtype', md: 12, children: ['Subtype'] } }
                ]
              },
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['URLValue'] } }
                ]
              }
            ]
          }
        }
      ]
    },
    Description: {
      'ui:title': 'URL Description',
      'ui:widget': 'textarea'
    },
    URLContentType: { 'ui:title': 'URL Content Type' },
    URLValue: { 'ui:title': 'URL Value' },
    Type: { 'ui:title': ' Type' }
  }

}
export default toolInformationUiSchema

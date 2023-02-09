import React from 'react'
import ControlledFields from '../../../../components/ControlledFields'
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
                { 'ui:col': { md: 6, children: ['Name'] } }
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
                { 'ui:col': { md: 6, children: ['Type'] } },
                { 'ui:col': { md: 6, children: ['LastUpdatedDate'] } }
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
                { 'ui:col': { style: { borderLeft: 'solid 10px rgb(240,240,240' }, md: 12, children: ['URL'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  LongName: {
    'ui:title': 'Long Name'
  },
  VersionDescription: {
    'ui:title': 'Version Description',
    'ui:widget': 'textarea'
  },
  LastUpdatedDate: {
    'ui:title': 'Last Updated Date'
  },
  Description: {
    'ui:title': 'Description',
    'ui:widget': 'textarea'
  },
  Type: {
    'ui:widget': CustomSelectWidget
  },
  URL: {
    'ui:title': 'URL',
    'ui:field': 'layout',
    'ui:controlledFields': ['URLContentType', 'Type', 'Subtype'],
    'ui:keywords': urltypes,
    'ui:layout_grid': {
      'ui:row': [
        {
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
                  {
                    'ui:col': {
                      md: 12,
                      children: [{
                        name: 'url-types',
                        render: (props) => (
                          <ControlledFields {...props} />
                        )
                      }]
                    }
                  }

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
    Type: { 'ui:title': ' URL Type' }
  }

}
export default toolInformationUiSchema

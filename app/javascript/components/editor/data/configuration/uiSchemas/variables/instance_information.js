import CustomSelectWidget from '../../../../components/widgets/CustomSelectWidget'
import CustomTextWidget from '../../../../components/widgets/CustomTextWidget'

const instanceInformationUiSchema = {
  'ui:field': 'layout',
  'ui:layout_grid': {
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            {
              'ui:row': [
                { 'ui:col': { md: 12, children: ['InstanceInformation'] } }
              ]
            }
          ]
        }
      }
    ]
  },
  InstanceInformation: {
    'ui:title': 'Instance Information',
    'ui:header-classname': 'h1-title',
    'ui:header-box-classname': 'h1-box',
    'ui:layout_grid': {
      'ui:row': [
        {
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:row': [
                  { 'ui:col': { md: 12, children: ['URL'] } },
                  { 'ui:col': { md: 12, children: ['Format'] } },
                  { 'ui:col': { md: 12, children: ['Description'] } },
                  { 'ui:col': { md: 12, children: ['DirectDistributionInformation'] } },
                  { 'ui:col': { md: 12, children: ['ChunkingInformation'] } }
                ]
              }
            ]
          }
        }
      ]
    },
    Format: {
      'ui:widget': CustomSelectWidget,
      'ui:controlled': {
        name: 'granule-data-format',
        controlName: 'short_name'
      }
    },
    Description: {
      'ui:widget': 'textarea'
    },
    DirectDistributionInformation: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Direct Distribution Information',
            'ui:group-description': true,
            'ui:group-classname': 'h2-title',
            'ui:group-box-classname': 'h2-box',
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['Region'] } },
                    { 'ui:col': { md: 12, children: ['S3BucketAndObjectPrefixNames'] } },
                    { 'ui:col': { md: 12, children: ['S3CredentialsAPIEndpoint'] } },
                    { 'ui:col': { md: 12, children: ['S3CredentialsAPIDocumentationURL'] } }
                  ]
                }
              ]
            }
          }
        ]
      },
      S3BucketAndObjectPrefixNames: {
        'ui:title': 'S3 Bucket and Object Prefix Name',
        items: {
          'ui:title': 'S3 Bucket and Object Prefix Name'
        }
      },
      S3CredentialsAPIEndpoint: {
        'ui:title': 'S3 Credentials API Endpoint',
        'ui:widget': CustomTextWidget
      },
      S3CredentialsAPIDocumentationURL: {
        'ui:title': 'S3 Credentials API Documentation URL',
        'ui:widget': CustomTextWidget
      }
    }
  }
}
export default instanceInformationUiSchema

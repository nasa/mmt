export const selectProps = {
  controlName: 'url_content_type',
  formData: {},
  idSchema: {
    $id: 'root_RelatedURLs_0',
    Description: {
      $id: 'root_RelatedURLs_0_Description'
    },
    Format: {
      $id: 'root_RelatedURLs_0_Format'
    },
    MimeType: {
      $id: 'root_RelatedURLs_0_MimeType'
    },
    Subtype: {
      $id: 'root_RelatedURLs_0_Subtype'
    },
    Type: {
      $id: 'root_RelatedURLs_0_Type'
    },
    URL: {
      $id: 'root_RelatedURLs_0_URL'
    },
    URLContentType: {
      $id: '_RelatedURLs_0_URLContentType'
    }
  },
  mapping: {
    map: {
      Subtype: 'subtype',
      Type: 'type',
      URLContentType: 'url_content_type'
    },
    name: 'related-urls'
  },
  name: 'URLContentType',
  onChange: jest.fn(),
  onSelectValue: null,
  registry: {
    formContext: {
      focusField: '',
      setFocusField: jest.fn()
    },
    schemaUtils: {
      retrieveSchema: jest.fn().mockReturnValue({
        type: 'object',
        additionalProperties: false,
        description: 'Represents Internet sites that contain information related to the data, as well as related Internet sites such as project home pages, related data archives/servers, metadata extensions, online software packages, web mapping services, and calibration/validation data.',
        properties: {
          Description: {
            description: 'Description of the web page at this URL.',
            type: 'string',
            minLength: 1,
            maxLength: 4000
          },
          URLContentType: {
            description: 'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
            type: 'string',
            minLength: 1,
            maxLength: 80,
            enum: [
              'DataCenterURL',
              'PublicationURL',
              'DataContactURL',
              'VisualizationURL',
              'DistributionURL',
              'CollectionURL'
            ]
          },
          Type: {
            description: 'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
            type: 'string',
            minLength: 1,
            maxLength: 80
          },
          Subtype: {
            description: 'A keyword describing the subtype of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
            type: 'string',
            minLength: 1,
            maxLength: 80
          },
          URL: {
            description: 'The web address for the relevant web page.',
            type: 'string',
            minLength: 1,
            maxLength: 1024
          },
          Format: {
            description: 'Describes the organization of the data content so that users and applications know how to read and use the content. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/DataFormat?gtm_scheme=DataFormat',
            type: 'string',
            minLength: 1,
            maxLength: 80
          },
          MimeType: {
            description: 'The multi-purpose internet mail extensions indicates the nature and format of the data that is accessed through the URL. The controlled vocabulary for MimeTypes is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/MimeType?gtm_scheme=MimeType',
            type: 'string',
            minLength: 1,
            maxLength: 80
          }
        },
        required: [
          'URL',
          'URLContentType',
          'Type'
        ]
      })
    }
  },
  schema: {
    additionalProperties: false,
    description: 'Represents Internet sites that contain information related to the data, as well as related Internet sites such as project home pages, related data archives/servers, metadata extensions, online software packages, web mapping services, and calibration/validation data.',
    properties: {
      Description: {
        description: 'Description of the web page at this URL.',
        maxLength: 4000,
        minLength: 1,
        type: 'string'
      },
      Format: {
        description: 'Describes the organization of the data content so that users and applications know how to read and use the content. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/DataFormat?gtm_scheme=DataFormat',
        maxLength: 80,
        minLength: 1,
        type: 'string'
      },
      MimeType: {
        description: 'The multi-purpose internet mail extensions indicates the nature and format of the data that is accessed through the URL. The controlled vocabulary for MimeTypes is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/MimeType?gtm_scheme=MimeType',
        maxLength: 80,
        minLength: 1,
        type: 'string'
      },
      Subtype: {
        description: 'A keyword describing the subtype of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
        maxLength: 80,
        minLength: 1,
        type: 'string'
      },
      Type: {
        description: 'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
        maxLength: 80,
        minLength: 1,
        type: 'string'
      },
      URL: {
        description: 'The web address for the relevant web page.',
        maxLength: 1024,
        minLength: 1,
        type: 'string'
      },
      URLContentType: {
        description: 'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
        enum: ['DataCenterURL', 'PublicationURL', 'DataContactURL', 'VisualizationURL', 'DistributionURL', 'CollectionURL'],
        maxLength: 80,
        minLength: 1,
        type: 'string'
      }
    },
    required: ['URL', 'URLContentType', 'Type'],
    type: 'object'
  },
  uiSchema: {}
}

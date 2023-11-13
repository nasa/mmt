const testSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UMM-T',
  type: 'object',
  additionalProperties: false,
  properties: {
    Name: {
      description: 'The name of the downloadable tool or web user interface.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    LongName: {
      description: 'The long name of the downloadable tool or web user interface.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    Version: {
      description:
        "The edition or version of the web user interface software, or tool. A value of 'NOT PROVIDED' may be used if the version is not available or unknown.",
      type: 'string',
      minLength: 1,
      maxLength: 20
    },
    Description: {
      description:
        'A brief description of the web user interface or downloadable tool. Note: This field allows lightweight markup language with plain text formatting syntax. Line breaks within the text are preserved.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    RelatedURLs: {
      description:
        'A URL associated with the web user interface or downloadable tool, e.g., the home page for the tool provider which is responsible for the tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/RelatedURLType'
      },
      minItems: 0
    }
  },
  required: [
    'Name',
    'LongName',
    'Version'
  ],
  definitions: {
    RelatedURLType: {
      type: 'object',
      additionalProperties: false,
      description:
        'Represents Internet sites that contain information related to the data, as well as related Internet sites such as project home pages, related data archives/servers, metadata extensions, online software packages, web mapping services, and calibration/validation data.',
      properties: {
        Description: {
          description: 'Description of the web page at this URL.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        URLContentType: {
          description:
            'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Type: {
          description:
            'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Subtype: {
          description:
            'A keyword describing the subtype of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
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
          description:
            'Describes the organization of the data content so that users and applications know how to read and use the content. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/DataFormat?gtm_scheme=DataFormat',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        MimeType: {
          description:
            'The multi-purpose internet mail extensions indicates the nature and format of the data that is accessed through the URL. The controlled vocabulary for MimeTypes is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/MimeType?gtm_scheme=MimeType',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: ['URL', 'URLContentType', 'Type']
    }
  }
}

export default testSchema

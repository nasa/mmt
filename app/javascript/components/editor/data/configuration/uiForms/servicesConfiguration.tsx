const servicesConfiguration: FormSection[] = [
  {
    displayName: 'Service Information',
    properties: [
      'Name',
      'LongName',
      'Version',
      'VersionDescription',
      'Type',
      'LastUpdatedDate',
      'Description',
      'URL'
    ]
  },
  {
    displayName: 'Service Constraints',
    properties: [
      'AccessConstraints',
      'UseConstraints'
    ]
  },
  {
    displayName: 'Descriptive Keywords',
    properties: [
      'ServiceKeywords',
      'AncillaryKeywords'
    ]
  },
  {
    displayName: 'Service Organizations',
    properties: [
      'ServiceOrganizations'
    ]
  },
  {
    displayName: 'Service Contacts',
    properties: [
      'ContactGroups',
      'ContactPersons'
    ]
  },
  {
    displayName: 'Options',
    properties: ['ServiceOptions']
  },
  {
    displayName: 'Operation Metadata',
    properties: ['OperationMetadata']
  },
  {
    displayName: 'Related URLs',
    properties: ['RelatedURLs']
  },
  {
    displayName: 'Service Quality',
    properties: ['ServiceQuality']
  }
]
export default servicesConfiguration

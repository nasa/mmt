const varConfiguration: FormSection[] = [
  {
    displayName: 'Variable Information',
    properties: [
      'Name',
      'StandardName',
      'LongName',
      'Definition',
      'AdditionalIdentifiers',
      'VariableType',
      'VariableSubType',
      'Units',
      'DataType',
      'Scale',
      'Offset',
      'ValidRanges',
      'IndexRanges'
    ]
  },
  {
    displayName: 'Fill Values',
    properties: ['FillValues']
  },
  {
    displayName: 'Dimensions',
    properties: ['Dimensions']
  },
  {
    displayName: 'Measurement Identifiers',
    properties: ['MeasurementIdentifiers']
  },
  {
    displayName: 'Sampling Identifiers',
    properties: ['SamplingIdentifiers']
  },
  {
    displayName: 'Science Keywords',
    properties: ['ScienceKeywords']
  },
  {
    displayName: 'Sets',
    properties: ['Sets']
  },
  {
    displayName: 'Related URLs',
    properties: ['RelatedURLs']
  }
]
export default varConfiguration

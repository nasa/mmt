const visualizationMapsConfiguration = [
  {
    displayName: 'Visualization Information',
    properties: [
      'Identifier',
      'Name',
      'Title',
      'Subtitle',
      'Description',
      'VisualizationType'
    ]
  },
  {
    displayName: 'Science Keywords',
    properties: ['ScienceKeywords']
  },
  {
    displayName: 'Spatial Extent',
    properties: [
      'SpatialExtent.SpatialCoverageType',
      'SpatialExtent.HorizontalSpatialDomain',
      'SpatialExtent.VerticalSpatialDomains',
      'SpatialExtent.OrbitParameters',
      'SpatialExtent.GranuleSpatialRepresentation'
    ]
  },
  {
    displayName: 'Temporal Extents',
    properties: [
      'TemporalExtents.PrecisionOfSeconds',
      'TemporalExtents.EndsAtPresentFlag',
      'TemporalExtents.RangeDateTimes',
      'TemporalExtents.SingleDateTimes',
      'TemporalExtents.PeriodicDateTimes',
      'TemporalExtents.TemporalResolution'
    ]
  },
  {
    displayName: 'Concept IDs',
    properties: ['ConceptIds']
  },
  {
    displayName: 'Metadata Specification',
    properties: [
      'MetadataSpecification.URL',
      'MetadataSpecification.Name',
      'MetadataSpecification.Version'
    ]
  },
  {
    displayName: 'Maps Specification',
    properties: [
      'Specification.SpecificationMap1',
      'Specification.SpecificationMap2'
    ]
  },
  {
    displayName: 'Maps Generation',
    properties: [
      'Generation.GenerationMap1',
      'Generation.GenerationMap2'
    ]
  }
]

export default visualizationMapsConfiguration

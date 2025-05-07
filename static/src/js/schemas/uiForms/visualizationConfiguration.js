const visualizationConfiguration = [
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
    displayName: 'Specification',
    properties: [
      'Specification'
    ]
  },
  {
    displayName: 'Generation',
    properties: [
      'Generation'
    ]
  }
]

export default visualizationConfiguration

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
    displayName: 'Tiles Specification',
    properties: [
      'Specification.ProductIdentification',
      'Specification.ProductMetadata'
    ]
  },
  {
    displayName: 'Tiles Generation',
    properties: [
      'Generation.SourceProjection',
      'Generation.SourceResolution',
      'Generation.SourceFormat',
      'Generation.SourceColorModel',
      'Generation.SourceNoDataIndexOrRGB',
      'Generation.SourceCoverage',
      'Generation.OutputProjection',
      'Generation.OutputResolution',
      'Generation.OutputFormat',
      'Generation.SourceData',
      'Generation.Reprojection',
      'Generation.Regridding',
      'Generation.Sampling',
      'Generation.Resolution',
      'Generation.QualityFlag',
      'Generation.Range',
      'Generation.Scale',
      'Generation.PixelStyle'
    ]
  }
]

export default visualizationConfiguration

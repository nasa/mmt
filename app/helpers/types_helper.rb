module TypesHelper
  PointsType = [ # Referenced by BoundaryType, GeometryType, LinesType, etc
    { name: 'Longitude' },
    { name: 'Latitude' }
  ]
  AccessConstraintsType = [
    { name: 'Description' },
    { name: 'Value' }
  ]
  AdditionalAttributesType = [
    { name: 'Name' },
    { name: 'Description' },
    { name: 'Value' },
    { name: 'DataType', options: [:select_type], select_type: 'DataTypeOptions' },
    { name: 'MeasurementResolution' },
    { name: 'ParameterRangeBegin' },
    { name: 'ParameterRangeEnd' },
    { name: 'ParameterUnitsOfMeasure' },
    { name: 'ParameterValueAccuracy' },
    { name: 'ValueAccuracyExplanation' },
    { name: 'Group' },
    { name: 'UpdateDate' }
  ]
  AddressesType = [
    { name: 'StreetAddresses', options: [:array_field] },
    { name: 'City' },
    { name: 'StateProvince' },
    { name: 'PostalCode' },
    { name: 'Country' }
  ]
  AltitudeSystemDefinitionType = [
    { name: 'DatumName' },
    { name: 'DistanceUnits' },
    { name: 'EncodingMethod' },
    { name: 'Resolutions', options: [:array_field] }
  ]
  BoundingRectanglesType = [
    { name: 'WestBoundingCoordinate' },
    { name: 'NorthBoundingCoordinate' },
    { name: 'EastBoundingCoordinate' },
    { name: 'SouthBoundingCoordinate' }
  ]
  BoundaryType = [
    { name: 'Points', options: [:sub_type] }
  ]
  BoundariesType = BoundaryType
  CharacteristicsType = [
    { name: 'Name' },
    { name: 'Description' },
    { name: 'Value' },
    { name: 'Unit' },
    { name: 'DataType' }
  ]
  ChronostratigraphicUnitsType = [
    { name: 'Eon' },
    { name: 'Era' },
    { name: 'Period' },
    { name: 'Epoch' },
    { name: 'Stage' },
    { name: 'DetailedClassification' }
  ]
  ContactsType = [
    { name: 'Type' },
    { name: 'Value' }
  ]
  ContentTypeType = [
    { name: 'Type' },
    { name: 'Subtype' }
  ]
  Coordinate1Type = [
    { name: 'MinimumValue' },
    { name: 'MaximumValue' }
  ]
  Coordinate2Type = Coordinate1Type
  DateType = [
    { name: 'Type', options: [:select_type], select_type: 'DateTypeOptions' },
    { name: 'Date' }
  ]
  DepthSystemDefinitionType = AltitudeSystemDefinitionType
  DirectoryNamesType = [
    { name: 'ShortName' },
    { name: 'LongName' }
  ]
  DistributionsType = [
    { name: 'DistributionMedia' },
    { name: 'Sizes', options: [:sub_type] },
    { name: 'DistributionFormat' },
    { name: 'Fees', options: [:handle_as_currency] }
  ]
  DOIType = [
    { name: 'DOI' },
    { name: 'Authority' }
  ]
  ExclusionZoneType = [
    { name: 'Boundaries', options: [:sub_type] }
  ]
  FileSizeType = [
    { name: 'Size' },
    { name: 'Unit' }
  ]
  GeodeticModelType = [
    { name: 'HorizontalDatumName' },
    { name: 'EllipsoidName' },
    { name: 'SemiMajorAxis' },
    { name: 'DenominatorOfFlatteningRatio' }
  ]
  GeographicCoordinateSystemType = [
    { name: 'GeographicCoordinateUnits' },
    { name: 'LatitudeResolution' },
    { name: 'LongitudeResolution' }
  ]
  GeometryType = [
    { name: 'CoordinateSystem', options: [:select_type], select_type: 'CoordinateSystemOptions'  },
    { name: 'Points', options: [:sub_type] },
    { name: 'BoundingRectangles', options: [:sub_type] },
    { name: 'GPolygons', options: [:sub_type] },
    { name: 'Lines', options: [:sub_type] }
  ]
  GPolygonsType = [
    { name: 'Boundary', options: [:sub_type] },
    { name: 'ExclusionZone', options: [:sub_type] }
  ]
  HorizontalCoordinateSystemType = [
    { name: 'GeodeticModel', options: [:sub_type] },
    { name: 'GeographicCoordinateSystem', options: [:sub_type] },
    { name: 'LocalCoordinateSystem', options: [:sub_type] }
]
  HorizontalSpatialDomainType = [
    { name: 'ZoneIdentifier' },
    { name: 'Geometry', options: [:sub_type] }
]
  InstrumentsType = [
    { name: 'ShortName' },
    { name: 'LongName' },
    { name: 'Characteristics', options: [:sub_type] },
    { name: 'Technique' },
    { name: 'NumberOfSensors' },
    { name: 'OperationalModes', options: [:array_field] },
    { name: 'Sensors', options: [:sub_type] }
  ]
  LinesType = [
    { name: 'Points', options: [:sub_type] }
  ]
  LocalCoordinateSystemType = [
    { name: 'GeoReferenceInformation' },
    { name: 'Description' }
]
  MetadataAssociationsType = [
    { name: 'Type', options: [:select_type], select_type: 'MetadataAssociationTypeOptions' },
    { name: 'Description' },
    { name: 'EntryId' },
    { name: 'ProviderId' }
  ]
  OrbitParametersType = [
    { name: 'SwathWidth' },
    { name: 'Period' },
    { name: 'InclinationAngle' },
    { name: 'NumberOfOrbits' },
    { name: 'StartCircularLatitude' }
  ]
  OrganizationNameType = [
    { name: 'ShortName' },
    { name: 'LongName' }
  ]
  PaleoTemporalCoverageType = [
    { name: 'ChronostratigraphicUnits', options: [:sub_type] },
    { name: 'StartDate' },
    { name: 'EndDate' }
  ]
  PartyType = [
    { name: 'OrganizationName', options: [:sub_type] },
    { name: 'Person', options: [:sub_type] },
    { name: 'ServiceHours' },
    { name: 'ContactInstructions' },
    { name: 'Contacts', options: [:sub_type] },
    { name: 'Addresses', options: [:sub_type] },
    { name: 'RelatedUrls', options: [:sub_type] }
  ]
  PeriodicDateTimesType = [
    { name: 'Name' },
    { name: 'StartDate' },
    { name: 'EndDate' },
    { name: 'DurationUnit', options: [:select_type], select_type: 'DurationOptions' },
    { name: 'DurationValue' },
    { name: 'PeriodCycleDurationUnit', options: [:select_type], select_type: 'DurationOptions' },
    { name: 'PeriodCycleDurationValue' }
  ]
  PersonType = [
    { name: 'FirstName' },
    { name: 'MiddleName' },
    { name: 'LastName' }
  ]
  PlatformsType = [
    { name: 'Type' },
    { name: 'ShortName' },
    { name: 'LongName' },
    { name: 'Characteristics', options: [:sub_type] },
    { name: 'Instruments', options: [:sub_type] }
  ]
  ProcessingLevelType = [
    { name: 'Id' },
    { name: 'ProcessingLevelDescription' }
  ]
  ProjectsType = [
    { name: 'ShortName' },
    { name: 'LongName' },
    { name: 'Campaigns', options: [:array_field] },
    { name: 'StartDate' },
    { name: 'EndDate' }
  ]
  PublicationReferencesType = [
    { name: 'RelatedUrl', options: [:sub_type] },
    { name: 'Title' },
    { name: 'Publisher' },
    { name: 'DOI', options: [:sub_type] },
    { name: 'Author' },
    { name: 'PublicationDate' },
    { name: 'Series' },
    { name: 'Edition' },
    { name: 'Volume' },
    { name: 'Issue' },
    { name: 'ReportNumber' },
    { name: 'PublicationPlace' },
    { name: 'Pages' },
    { name: 'ISBN' },
    { name: 'OtherReferenceDetails' }
  ]
  RangeDateTimesType = [
    { name: 'BeginningDateTime' },
    { name: 'EndingDateTime' }
  ]
  RelatedUrlType = [
    { name: 'Title' },
    { name: 'Description' },
    { name: 'URLs', options: [:array_field] },
    { name: 'MimeType' },
    { name: 'FileSize', options: [:sub_type] }
  ]
  RelatedUrlsType = RelatedUrlType
  ResourceCitationType = [
    { name: 'Version' },
    { name: 'RelatedUrl', options: [:sub_type] },
    { name: 'Title' },
    { name: 'Creator' },
    { name: 'Editor' },
    { name: 'SeriesName' },
    { name: 'ReleaseDate' },
    { name: 'ReleasePlace' },
    { name: 'Publisher' },
    { name: 'IssueIdentification' },
    { name: 'DataPresentationForm' },
    { name: 'OtherCitationDetails' },
    { name: 'DOI', options: [:sub_type] }
  ]
  ResponsibilityType = [
    { name: 'Role', options: [:select_type], select_type: 'RoleOptions' },
    { name: 'Party', options: [:sub_type] }
  ]
  SensorsType = [
    { name: 'ShortName' },
    { name: 'LongName' },
    { name: 'Technique' },
    { name: 'Characteristics', options: [:sub_type] }
  ]
  SpatialExtentType = [
    { name: 'SpatialCoverageType', options: [:select_type], select_type: 'SpatialCoverageTypeOptions' },
    { name: 'HorizontalSpatialDomain', options: [:sub_type] },
    { name: 'VerticalSpatialDomains', options: [:sub_type] },
    { name: 'OrbitParameters', options: [:sub_type] },
    { name: 'GranuleSpatialRepresentation', options: [:select_type], select_type: 'GranuleSpatialRepresentationOptions' }
  ]
  SpatialInformationType = [
    { name: 'SpatialCoverageType', options: [:select_type], select_type: 'SpatialCoverageTypeOptions'  },
    { name: 'HorizontalCoordinateSystem', options: [:sub_type] },
    { name: 'VerticalCoordinateSystem', options: [:sub_type] }
  ]
  # SpatialKeywordsType = [ # Is a simple array, handled at the hierarchy top
  # ]
  TemporalExtentsType = [
    { name: 'TemporalRangeType' },
    { name: 'PrecisionOfSeconds' },
    { name: 'EndsAtPresentFlag' },
    { name: 'RangeDateTimes', options: [:sub_type] },
    { name: 'SingleDateTimes', options: [:array_field] },
    { name: 'PeriodicDateTimes', options: [:sub_type] }
  ]
  TilingIdentificationSystemType = [
    { name: 'TilingIdentificationSystemName' },
    { name: 'Coordinate1', options: [:sub_type]  },
    { name: 'Coordinate2', options: [:sub_type]  }
  ]
  VerticalCoordinateSystemType = [
    { name: 'AltitudeSystemDefinition', options: [:sub_type] },
    { name: 'DepthSystemDefinition', options: [:sub_type] }
  ]
  VerticalSpatialDomainsType = [
    { name: 'Type' },
    { name: 'Value' }
  ]
end

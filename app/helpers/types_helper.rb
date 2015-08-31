module TypesHelper
  AccessConstraintsType = [
    { name: 'Description' },
    { name: 'Value' }
  ]
  AddressType = [
    { name: 'StreetAddress', options: [:array_field] },
    { name: 'City' },
    { name: 'StateProvince' },
    { name: 'PostalCode' },
    { name: 'Country' }
  ]
  CharacteristicsType = [
    { name: 'Name' },
    { name: 'Description' },
    { name: 'Value' },
    { name: 'Unit' },
    { name: 'DataType' }
  ]
  ChronostratigraphicUnitType = [
    { name: 'Eon' },
    { name: 'Era' },
    { name: 'Epoch' },
    { name: 'Stage' },
    { name: 'DetailedClassification' },
    { name: 'Period' }
  ]
  ContactType = [
    { name: 'Type' },
    { name: 'Value' }
  ]
  ContentTypeType = [
    { name: 'Type' },
    { name: 'Subtype' }
  ]
  DistributionType = [
    { name: 'DistributionMedia' },
    { name: 'DistributionSize' },
    { name: 'DistributionFormat' },
    { name: 'Fees', options: [:handle_as_currency] }
  ]
  DOIType = [
    { name: 'DOI' },
    { name: 'Authority' }
  ]
  EntryIdType = [
    { name: 'Id' },
    { name: 'Version' },
    { name: 'Authority' }
  ]
  FileSizeType = [
    { name: 'Size' },
    { name: 'Unit' }
  ]
  InstrumentsType = [
    { name: 'ShortName' },
    { name: 'LongName' },
    { name: 'Characteristics', options: [:sub_type] },
    { name: 'Technique' },
    { name: 'NumberOfSensors' },
    { name: 'OperationalMode', options: [:array_field] },
    { name: 'Sensors', options: [:sub_type] }
  ]
  LineageDateType = [
    { name: 'Type', options: [:select_type], select_type: 'DateTypeOptions' },
    { name: 'Date' },
    { name: 'Description' },
    { name: 'Responsibility', options: [:sub_type] }
  ]
  LineageType = [
    # TODO, huh?
    { name: 'Date', options: [:sub_type, :lineage_date] }
  ]
  MetadataAssociationType = [
    { name: 'Type' },
    { name: 'Description' },
    { name: 'EntryId', options: [:sub_type] },
    { name: 'ProviderId' }
  ]
  OrganizationNameType = [
    { name: 'ShortName' },
    { name: 'LongName' }
  ]
  PaleoTemporalCoverageType = [
    { name: 'ChronostratigraphicUnit', options: [:sub_type] },
    { name: 'StartDate' },
    { name: 'EndDate' }
  ]
  PartyType = [
    { name: 'OrganizationName', options: [:sub_type] },
    { name: 'Person', options: [:sub_type] },
    { name: 'ServiceHours' },
    { name: 'ContactInstructions' },
    { name: 'Contact', options: [:sub_type] },
    { name: 'Address', options: [:sub_type] },
    { name: 'RelatedUrl', options: [:sub_type] }
  ]
  PeriodicDateTimeType = [
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
  PlatformType = [
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
  ProjectType = [
    { name: 'ShortName' },
    { name: 'LongName' },
    { name: 'Campaign', options: [:array_field] },
    { name: 'StartDate' },
    { name: 'EndDate' }
  ]
  PublicationReferenceType = [
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
  RangeDateTimeType = [
    { name: 'BeginningDateTime' },
    { name: 'EndingDateTime' }
  ]
  RelatedUrlType = [
    { name: 'URL', options: [:array_field] },
    { name: 'Description' },
    { name: 'Protocol' },
    { name: 'MimeType' },
    { name: 'Caption' },
    { name: 'Title' },
    { name: 'FileSize', options: [:sub_type] },
    { name: 'ContentType', options: [:sub_type] }
  ]
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
  TemporalExtentType = [
    { name: 'PrecisionOfSeconds' },
    { name: 'EndsAtPresentFlag' },
    { name: 'RangeDateTime', options: [:sub_type] },
    { name: 'SingleDateTime', options: [:array_field] },
    { name: 'PeriodicDateTime', options: [:sub_type] }
  ]
end

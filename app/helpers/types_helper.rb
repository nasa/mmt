module TypesHelper
  AccessConstraintsType = [
    { name: 'Description' },
    { name: 'Value' }
  ]
  AddressesType = [
    { name: 'StreetAddresses', options: [:array_field] },
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
  ChronostratigraphicUnitsType = [
    { name: 'Eon' },
    { name: 'Era' },
    { name: 'Epoch' },
    { name: 'Stage' },
    { name: 'DetailedClassification' },
    { name: 'Period' }
  ]
  ContactsType = [
    { name: 'Type' },
    { name: 'Value' }
  ]
  ContentTypeType = [
    { name: 'Type' },
    { name: 'Subtype' }
  ]
  DateType = [
    { name: 'Type', options: [:select_type], select_type: 'DateTypeOptions' },
    { name: 'Date' }
  ]
  DistributionsType = [
    { name: 'DistributionMedia' },
    { name: 'DistributionSize' },
    { name: 'DistributionFormat' },
    { name: 'Fees', options: [:handle_as_currency] }
  ]
  DOIType = [
    { name: 'DOI' },
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
    { name: 'OperationalModes', options: [:array_field] },
    { name: 'Sensors', options: [:sub_type] }
  ]
  MetadataAssociationsType = [
    { name: 'Type' },
    { name: 'Description' },
    { name: 'EntryId' },
    { name: 'ProviderId' }
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
    { name: 'URLs', options: [:array_field] },
    { name: 'Description' },
    { name: 'Protocol' },
    { name: 'MimeType' },
    { name: 'Caption' },
    { name: 'Title' },
    { name: 'FileSize', options: [:sub_type] },
    { name: 'ContentType', options: [:sub_type] }
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
  TemporalExtentsType = [
    { name: 'PrecisionOfSeconds' },
    { name: 'EndsAtPresentFlag' },
    { name: 'RangeDateTimes', options: [:sub_type] },
    { name: 'SingleDateTimes', options: [:array_field] },
    { name: 'PeriodicDateTimes', options: [:sub_type] }
  ]
end

module DraftsHelper
  AltitudeDistanceUnitsOptions = [
    ['HectoPascals'],
    ['Kilometers'],
    ['Millibars']
  ]
  ArchiveDistributionFormatTypeOptions = [
    ['Native'],
    ['Supported']
  ]
  ArchiveDistributionUnitOptions = [
    ['KB'],
    ['MB'],
    ['GB'],
    ['TB'],
    ['PB'],
    ['NA']
  ]
  CollectionDataTypeOptions = [
    ['Science Quality', 'SCIENCE_QUALITY'],
    ['Near Real Time', 'NEAR_REAL_TIME'],
    ['Low Latency', 'LOW_LATENCY'],
    ['Expedited', 'EXPEDITED'],
    ['Other', 'OTHER']
  ]
  CollectionProgressOptions = [
    ['Active', 'ACTIVE'],
    ['Planned', 'PLANNED'],
    ['Complete', 'COMPLETE'],
    ['Deprecated', 'DEPRECATED'],
    ['Not Applicable', 'NOT APPLICABLE'],
    ['Not Provided', 'NOT PROVIDED']
  ]
  CoordinateSystemOptions = [
    ['Cartesian', 'CARTESIAN'],
    ['Geodetic', 'GEODETIC']
  ]
  ContactMechanismTypeOptions = [
    ['Direct Line'],
    ['Email'],
    ['Facebook'],
    ['Fax'],
    ['Mobile'],
    ['Modem'],
    ['Primary'],
    ['TDD/TTY Phone'],
    ['Telephone'],
    ['Twitter'],
    ['U.S. toll free'],
    ['Other']
  ]
  DataCenterRoleOptions = [
    ['Archiver', 'ARCHIVER'],
    ['Distributor', 'DISTRIBUTOR'],
    ['Originator', 'ORIGINATOR'],
    ['Processor', 'PROCESSOR']
  ]
  DataContactRoleOptions = [
    ['Data Center Contact'],
    ['Technical Contact'],
    ['Science Contact'],
    ['Investigator'],
    ['Metadata Author'],
    ['User Services'],
    ['Science Software Development']
  ]
  DataContactTypeOptions = [
    ['Data Center Contact Person', 'DataCenterContactPerson'],
    ['Data Center Contact Group', 'DataCenterContactGroup'],
    ['Non Data Center Contact Person', 'NonDataCenterContactPerson'],
    ['Non Data Center Contact Group', 'NonDataCenterContactGroup']
  ]
  DataTypeOptions = [
    ['String', 'STRING'],
    ['Float', 'FLOAT'],
    ['Integer', 'INT'],
    ['Boolean', 'BOOLEAN'],
    ['Date', 'DATE'],
    ['Time', 'TIME'],
    ['Date time', 'DATETIME'],
    ['Date String', 'DATE_STRING'],
    ['Time String', 'TIME_STRING'],
    ['Date Time String', 'DATETIME_STRING']
  ]
  DepthDistanceUnitsOptions = [
    ['Fathoms'],
    ['Feet'],
    ['HectoPascals'],
    ['Meters'],
    ['Millibars']
  ]
  DurationOptions = [
    ['Day', 'DAY'],
    ['Month', 'MONTH'],
    ['Year', 'YEAR']
  ]
  DateTypeOptions = [
    ['Creation', 'CREATE'],
    ['Last Revision', 'UPDATE'],
    ['Future Review', 'REVIEW'],
    ['Planned Deletion', 'DELETE']
  ]
  DirectDistributionInformationRegionOptions = [
    ["us-east-1"],
    ["us-east-2"],
    ["us-west-1"],
    ["us-west-2"]
  ]
  DOIMissingReasonOptions = [
    ['Not Applicable'],
    ['Unknown']
  ]
  FileSizeUnitTypeOptions = [
    ['KB'],
    ['MB'],
    ['GB'],
    ['TB'],
    ['PB']
  ]
  GeographicCoordinateUnitsOptions = [
    ['Decimal Degrees'],
    ['Kilometers'],
    ['Meters']
  ]
  GetDataTypeFormatOptions = [
    ['ascii'],
    ['binary'],
    ['GRIB'],
    ['BUFR'],
    ['HDF4'],
    ['HDF5'],
    ['HDF-EOS4'],
    ['HDF-EOS5'],
    ['jpeg'],
    ['png'],
    ['tiff'],
    ['geotiff'],
    ['kml'],
    ['Not provided']
  ]
  GranuleSpatialRepresentationOptions = [
    ['Cartesian', 'CARTESIAN'],
    ['Geodetic', 'GEODETIC'],
    ['Orbit', 'ORBIT'],
    ['No Spatial', 'NO_SPATIAL']
  ]
  HorizontalDataResolutionUnitEnumOptions = [
    ['Decimal Degrees'],
    ['Kilometers'],
    ['Meters'],
    ['Statute Miles'],
    ['Nautical Miles'],
    ['Not provided']
  ]
  HorizontalResolutionScanDirectionTypeOptions = [
    ['Along Track'],
    ['Cross Track']
  ]
  HorizontalResolutionViewingAngleTypeOptions = [
    ['At Nadir'],
    ['Scan Extremes']
  ]
  MetadataAssociationTypeOptions = [
    ['Science Associated', 'SCIENCE ASSOCIATED'],
    ['Dependent', 'DEPENDENT'],
    ['Input', 'INPUT'],
    ['Parent', 'PARENT'],
    ['Child', 'CHILD'],
    ['Related', 'RELATED'],
    ['Larger Citation Works', 'LARGER CITATION WORKS']
  ]
  MimeTypeOptions = [
    ['application/json'],
    ['application/xml'],
    ['application/x-netcdf'],
    ['application/gml+xml'],
    ['application/opensearchdescription+xml'],
    ['application/vnd.google-earth.kml+xml'],
    ['image/gif'],
    ['image/tiff'],
    ['image/bmp'],
    ['text/csv'],
    ['text/xml'],
    ['application/pdf'],
    ['application/x-hdf'],
    ['application/xhdf5'],
    ['application/octet-stream'],
    ['application/vnd.google-earth.kmz'],
    ['image/jpeg'],
    ['image/png'],
    ['image/vnd.collada+xml'],
    ['text/html'],
    ['text/plain'],
    ['Not provided']
  ]
  ProcessingLevelIdOptions = [
    ['Not Provided'],
    ['0'],
    ['1'],
    ['1A'],
    ['1B'],
    ['1C'],
    ['1T'],
    ['2'],
    ['2G'],
    ['2P'],
    ['3'],
    ['4'],
    ['NA']
  ]
  ProtocolOptions = [
    ['HTTP'],
    ['HTTPS'],
    ['FTP'],
    ['FTPS'],
    ['Not provided']
  ]
  RoleOptions = [
    ['Resource Provider', 'RESOURCEPROVIDER'],
    ['Custodian', 'CUSTODIAN'],
    ['Owner', 'OWNER'],
    ['User', 'USER'],
    ['Distributor', 'DISTRIBUTOR'],
    ['Originator', 'ORIGINATOR'],
    ['Point of Contact', 'POINTOFCONTACT'],
    ['Principal Investigator', 'PRINCIPALINVESTIGATOR'],
    ['Processor', 'PROCESSOR'],
    ['Publisher', 'PUBLISHER'],
    ['Author', 'AUTHOR'],
    ['Sponsor', 'SPONSOR'],
    ['Co-Author', 'COAUTHOR'],
    ['Collaborator', 'COLLABORATOR'],
    ['Editor', 'EDITOR'],
    ['Mediator', 'MEDIATOR'],
    ['Rights Holder', 'RIGHTSHOLDER'],
    ['Contributor', 'CONTRIBUTOR'],
    ['Funder', 'FUNDER'],
    ['Stakeholder', 'STAKEHOLDER']
  ]
  SpatialCoverageTypeOptions = [
    ['Horizontal', 'HORIZONTAL'],
    ['Vertical', 'VERTICAL'],
    ['Orbital', 'ORBITAL'],
    ['Horizontal and Vertical', 'HORIZONTAL_VERTICAL'],
    ['Orbital and Vertical', 'ORBITAL_VERTICAL'],
    ['Horizontal and Orbital', 'HORIZONTAL_ORBITAL'],
    ['Horizontal, Vertical, and Orbital', 'HORIZONTAL_VERTICAL_ORBITAL']
  ]
  TilingIdentificationSystemNameOptions = [
    ['CALIPSO'],
    ['MISR'],
    ['MODIS Tile EASE'],
    ['MODIS Tile SIN'],
    ['WELD Alaska Tile'],
    ['WELD CONUS Tile'],
    ['WRS-1'],
    ['WRS-2'],
    ['Military Grid Reference System']
  ]
  VerticalSpatialDomainTypeOptions = [
    ['Atmosphere Layer'],
    ['Maximum Altitude'],
    ['Maximum Depth'],
    ['Minimum Altitude'],
    ['Minimum Depth']
  ]

  SINGLE_FIELDSET_FORMS = %w(
    collection_information
    collection_citations
    data_centers
    data_contacts
    related_urls
  )

  def construct_keyword_string(hash_obj, str)
    # Assumes hash is passed in as ordered
    hash_obj.each do |_key, value|
      if value.is_a?(String)
        str << ' > ' unless str.blank?
        str = str << value
      else # Use tail recursion to construct the string found in the sub-hash
        str = construct_keyword_string(value, str)
      end
    end
    str
  end

  # Takes a html element name (draft_|metadata_lineage|_index_role) and
  # outputs a param name (draft[metadata_lineage][index][role])
  # Words that should keep their underscore should be wrapped in pipes, like "_|metadata_lineage|_"
  # For param elements that need to be an array (update_value[contact_information][related_urls][][url]), use two underscores in a row
  def name_to_param(name)
    # convert good words (wrapped in pipes) to dashes
    name.gsub!(/(_?)\|(\w+)\|(_?)/) { "#{Regexp.last_match[1]}#{Regexp.last_match[2].dasherize}#{Regexp.last_match[3]}" }

    # split words on underscores, wrap in brackets, and convert good words back to underscores
    name = name.split('_').map.with_index do |word, index|
      word = word.gsub(/(?<!new)index/, '').underscore
      if index == 0
        word
      else
        "[#{word}]"
      end
    end

    # join wrapped words
    name.join
  end

  def remove_pipes(string)
    string.delete('|')
  end

  def keyword_string(keywords)
    keywords.map { |_key, value| value }.join(' > ')
  end

  def keyword_recommendation_array(recommended_keyword)
    recommended_keyword.split('>').map(&:strip)
  end

  def keyword_recommendation_string(recommended_keyword)
    keyword_recommendation_array(recommended_keyword).join(' > ')
  end

  def keyword_recommendation_list(recommended_keywords)
    recommended_keywords.join(',')
  end

  def keyword_recommendations_array(recommended_keywords)
    recommended_keywords.split(',').map(&:strip)
  end

  def options_for_subregion_select(country, value = nil)
    return nil unless country

    # TODO This is currently implemented to use the coded alias values as well for StateProvince.
    # The coded alias can be used for Country Names as well. We should attempt to use the coded values
    # for matching, as well as try and match various cases and use of periods

    options = country.subregions.map(&:name).sort
    options.unshift ['Select State/Province', '']
    if value && invalid_select_option(options, value)
      # there is an invalid selection
      if country.subregions.coded(value)
        # if the subregion (StateProvince) value matches a valid Carmen code/alias, save use the main value
        value = country.subregions.coded(value)
        disabled_options = nil
      else
        # append invalid disabled option
        options.unshift value
        disabled_options = value
      end
    end
    options_for_select(options, selected: value, disabled: disabled_options)
  end

  def short_name_header(draft_type)
    if draft_type == 'variable_draft'
      'Name'
    else
      'Short Name'
    end
  end

  def entry_title_header(draft_type)
    if draft_type == 'variable_draft'
      'Long Name'
    else
      'Entry Title'
    end
  end

  def titleize_form_name(form_name)
    return 'Related URLs' if form_name == 'related_urls'
    return 'Compatibility and Usability' if form_name == 'compatibility_and_usability'
    form_name.titleize
  end

  # this method is used for UMM-T draft tests, but can't be put in the spec
  # helpers for context/scope reasons
  def get_next_form(name, forms, direction)
    delta = direction == 'Next' ? 1 : -1
    index = forms.index(name)
    forms[index + delta] || forms.first
  end
end

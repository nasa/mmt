module DraftsHelper
  CollectionDataTypeOptions = [
    ['Select Data Type', ''],
    ['Science Quality', 'SCIENCE_QUALITY'],
    ['Near Real Time', 'NEAR_REAL_TIME'],
    ['Other', 'OTHER']
  ]
  CollectionProgressOptions = [
    ['Select Progress', ''],
    ['Planned', 'PLANNED'],
    ['In work', 'IN WORK'],
    ['Complete', 'COMPLETE']
  ]
  CoordinateSystemOptions = [
      ['Cartesian', 'CARTESIAN'],
      ['Geodetic', 'GEODETIC']
  ]
  DurationOptions = [
    ['Select Duration', ''],
    ['Day', 'DAY'],
    ['Month', 'MONTH'],
    ['Year', 'YEAR']
  ]
  DateTypeOptions = [
    ['Select Date Type', ''],
    ['Create', 'CREATE'],
    ['Update', 'UPDATE'],
    ['Delete', 'DELETE'], ['Review', 'REVIEW']
  ]
  GranuleSpatialRepresentationOptions = [
    ['Select Granule Spatial Representation', ''],
    ['Cartesian', 'CARTESIAN'],
    ['Geodetic', 'GEODETIC'],
    ['Orbit', 'ORBIT'],
    ['No Spatial', 'NO_SPATIAL'],
  ]
  RoleOptions = [
    ['Select Role', ''],
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
      ['Both', 'BOTH'] # Perhaps 'Both' should actually read 'Horizontal and Vertical', to be more clear to the user
  ]

  def construct_keyword_string(hash_obj, str)
    # Assumes hash is passed in as ordered
    hash_obj.each do |key, value|
      if value.is_a?(String)
        str << ' > ' if !str.blank?
        str = str << value
      else # Use tail recursion to construct the string found in the sub-hash
        str = construct_keyword_string(value, str)
      end
    end
    return str
  end

  # Takes a html element name (draft_|metadata_lineage|_index_role) and
  # outputs a param name (draft[metadata_lineage][index][role])
  # Words that should keep their underscore should be wrapped in pipes, like "_|metadata_lineage|_"
  def name_to_param(name)
    # convert good words (wrapped in pipes) to dashes
    name.gsub!(/(_?)\|(\w+)\|(_?)/) {"#{$1}#{$2.dasherize}#{$3}"}

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
    string.gsub('|', '')
  end

  #Change json keys like 'FileSize' to acceptable html class names like 'file-size'
  def name_to_class(key)
    if key == 'URLs'
      'urls'
    else
      key.to_s.underscore.dasherize
    end
  end

  def name_to_title(name)
    is_id = name.end_with?('Id') && name.size > 2 ? ' Id' : ''

    if name == 'URLs'
      'URLs'
    else
      name.underscore.titleize + is_id
    end
  end

  # Used to derive the displayed string of a select type control from the value stored in json
  def map_value_onto_display_string(str, options)
    options_hash = Hash[options.map{|key, value| [value, key]}]
    return options_hash[str]
  end

end

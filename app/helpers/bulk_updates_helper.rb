module BulkUpdatesHelper
  # * For the scope of MMT-874 all fields are text fields but as we move toward
  #   a more complex and functional filtering tool we should make data entry
  #   easier by supplying the correct input for the data type.
  SEARCHABLE_KEYS = [
    ['2D Coordinate System Name', 'two_d_coordinate_system_name'],
    ['Archive Center', 'archive_center'],
    ['Browsable', 'browsable'], # * should be an enum (true / false)
    ['Browse Only', 'browse_only'], # * should be an enum (true / false)
    ['Concept ID', 'concept_id'],
    ['DOI Value', 'doi'],
    ['Data Center', 'data_center'],
    ['Data Type', 'collection_data_type'], # * should be an enum
    ['Data Type', 'data_type'],
    ['Downloadable', 'downloadable'], # * should be an enum (true / false)
    ['ECHO Collection ID', 'echo_collection_id'],
    ['Entry ID', 'entry_id'],
    ['Entry Title', 'entry_title'],
    ['Has Granules', 'has_granules'], # * should be an enum (true / false)
    ['Instrument', 'instrument'],
    ['Online Only', 'online_only'], # * should be an enum (true / false)
    ['Platform', 'platform'],
    ['Processing Level ID', 'processing_level_id'],
    ['Project', 'project'],
    ['Revision Date', 'revision_date'], # * should be a date picker
    ['Science Keywords', 'science_keywords'],
    ['Sensor', 'sensor'],
    ['Short Name', 'short_name'],
    ['Spatial Keyword', 'spatial_keyword'],
    ['Temporal', 'temporal'],
    ['Updated Since', 'updated_since'], # * should be a date picker
    ['Version', 'version']
  ].freeze
end

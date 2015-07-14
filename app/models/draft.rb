class Draft < ActiveRecord::Base
  belongs_to :user

  DRAFT_FORMS = [
      {:name=>'Data Identification', :go_to_page=>'data_identification'},
      {:name=>'Descriptive Keywords', :go_to_page=>'descriptive_keywords'},
      {:name=>'Distribution Information', :go_to_page=>'distribution_information'},
      {:name=>'Temporal Extent', :go_to_page=>'temporal_extent'},
      {:name=>'Spatial Extent', :go_to_page=>'spatial_extent'},
      {:name=>'Acquisition Information', :go_to_page=>'acquisition_information'},
      {:name=>'Metadata Information', :go_to_page=>'metadata_information'}
  ]


end

module Helpers
  module DraftHelpers
    def output_schema_validation(draft)
      schema = 'lib/assets/schemas/umm-c-json-schema.json'
      JSON::Validator.fully_validate(schema, draft).each do |error|
        puts error
      end
    end

    def create_new_draft
      visit '/dashboard'
      choose 'New Collection Record'
      click_on 'Create Record'
    end

    def open_accordions
      script = "$('.accordion.is-closed').removeClass('is-closed');"
      page.evaluate_script script
    end

    MISMATCHED_KEYS = %w(
      DataDates
      MetadataDates
      Organizations
      Personnel
      CollectionCitations
    )

    def check_css_path_for_display_of_values(rendered, draft, key, path, special_handling = {}, top_level = false)
      path += " > li.#{name_to_class(key)}" if top_level

      case draft
      when NilClass
        # Don't expect any values
      when String, Fixnum, FalseClass, TrueClass
        new_path = path

        parent_key_special_handling = special_handling[key.to_sym]
        if parent_key_special_handling == :handle_as_currency && draft =~ /\A[-+]?\d*\.?\d+\z/
          draft = number_to_currency(draft.to_f)
        elsif parent_key_special_handling == :handle_as_role
          # Map role value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::RoleOptions)
        elsif parent_key_special_handling == :handle_as_duration
          # Map duration value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::DurationOptions)
        elsif parent_key_special_handling == :handle_as_collection_data_type
          # Map duration value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::CollectionDataTypeOptions)
        elsif parent_key_special_handling == :handle_as_date_type
          # Map date type value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::DateTypeOptions)
        elsif parent_key_special_handling == :handle_as_data_type
          # Map data type value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::DataTypeOptions)
        elsif parent_key_special_handling == :handle_as_collection_progress
          # Map duration value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::CollectionProgressOptions)
        elsif parent_key_special_handling == :handle_as_granule_spatial_representation
          # Map value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::GranuleSpatialRepresentationOptions)
        elsif parent_key_special_handling == :handle_as_spatial_coverage_type
          # Map value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::SpatialCoverageTypeOptions)
        elsif parent_key_special_handling == :handle_as_coordinate_system_type
          # Map value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::CoordinateSystemOptions)
        elsif key.include?('iso-topic-categories-')
          draft = map_value_onto_display_string(draft, DraftsHelper::ISOTopicCategoriesOptions)
        elsif parent_key_special_handling == :handle_as_not_shown
          # This field is present in json, but intentionally not displayed
          return
        end

        expect(rendered.find(:css, new_path)).to have_content(draft)

      when Hash
        top_path = ''
        top_path = ' > ul' if top_level

        draft.each do |new_key, value|
          new_path = path + top_path

          new_path += " > li.#{name_to_class(new_key)}"
          if "TypesHelper::#{new_key}Type".safe_constantize
            new_path += ' > ul' unless key == 'DOI' || new_key == 'Date'
          end
          check_css_path_for_display_of_values(rendered, value, new_key, new_path, special_handling)
        end

      when Array
        # ScienceKeywords are displayed differently than all other fields
        # Catch it at this level for testing
        if key == 'ScienceKeywords'
          draft.each_with_index do |value, index|
            new_path = path + " > ul > li.science-keywords-#{index}"

            expect(rendered.find(:css, new_path)).to have_content(keyword_string(value))
          end
        else
          draft.each_with_index do |value, index|
            new_path = path

            class_name = "#{name_to_class(key)}-#{index}"
            if "TypesHelper::#{key}Type".safe_constantize
              new_path += "#{' > ul' if top_level}.#{class_name}"
            elsif MISMATCHED_KEYS.include?(key)
              new_path += " > ul.#{class_name}"
            else
              new_path += " > ul > li.#{class_name}"
            end

            check_css_path_for_display_of_values(rendered, value, class_name, new_path, special_handling)
          end
        end
      end
    end

    def add_organization
      fill_in 'Short Name', with: 'ORG_SHORT'
      fill_in 'Long Name', with: 'Organization Long Name'
      fill_in 'Uuid', with: 'de135797-8539-4c3a-bc20-17a83d75aa49'
    end

    def add_person
      fill_in 'First Name', with: 'First Name'
      fill_in 'Middle Name', with: 'Middle Name'
      fill_in 'Last Name', with: 'Last Name'
      fill_in 'Uuid', with: '351bb40b-0287-44ce-ba73-83e47f4945f8'
    end

    def add_responsibilities(type = nil)
      within '.multiple.responsibilities' do
        select 'Resource Provider', from: 'Role'
        case type
        when 'organization'
          add_organization
        when 'personnel'
          add_person
        else
          find('.responsibility-picker.organization').click
          add_organization
        end

        fill_in 'Service Hours', with: '9-5, M-F'
        fill_in 'Contact Instructions', with: 'Email only'

        add_contacts
        add_addresses
        add_related_urls

        click_on "Add another #{(type || 'responsibility').titleize}"
        within '.multiple-item.accordion.multiple-item-1' do
          select 'Owner', from: 'Role'
          case type
          when 'organization'
            add_organization
          when 'personnel'
            add_person
          else
            find('.responsibility-picker.person').click
            add_person
          end

          fill_in 'Service Hours', with: '10-2, M-W'
          fill_in 'Contact Instructions', with: 'Email only'

          add_contacts
          add_addresses
          add_related_urls
        end
      end
    end

    def add_dates
      within '.multiple.dates' do
        select 'Create', from: 'Type'
        fill_in 'Date', with: '2015-07-01T00:00:00Z'

        click_on 'Add another Date'
        within '.multiple-item-1' do
          select 'Review', from: 'Type'
          fill_in 'Date', with: '2015-07-02T00:00:00Z'
        end
      end
    end

    def add_contacts
      within '.multiple.contacts' do
        fill_in 'Type', with: 'Email'
        fill_in 'Value', with: 'example@example.com'
        click_on 'Add another Contact'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'Email'
          fill_in 'Value', with: 'example2@example.com'
        end
      end
    end

    def add_addresses
      within '.multiple.addresses' do
        within '.multiple.addresses-street-addresses' do
          within first('.multiple-item') do
            find('input').set '300 E Street Southwest'
          end
          within all('.multiple-item').last do
            find('input').set 'Room 203'
          end
        end
        fill_in 'City', with: 'Washington'
        fill_in 'State / Province', with: 'DC'
        fill_in 'Postal Code', with: '20546'
        fill_in 'Country', with: 'United States'
        click_on 'Add another Address'
        within '.multiple-item.accordion.multiple-item-1' do
          within '.multiple.addresses-street-addresses' do
            within first('.multiple-item') do
              find('input').set '8800 Greenbelt Road'
            end
          end
          fill_in 'City', with: 'Greenbelt'
          fill_in 'State / Province', with: 'MD'
          fill_in 'Postal Code', with: '20771'
          fill_in 'Country', with: 'United States'
        end
      end
    end

    def add_related_urls(single = nil)
      within "#{'.multiple' unless single}.related-url#{'s' unless single}" do
        within '.multiple.related-url-url' do
          within '.multiple-item-0' do
            find('.url').set 'http://example.com'
            click_on 'Add another URL'
          end
          within '.multiple-item-1' do
            find('.url').set 'http://another-example.com'
          end
        end
        fill_in 'Description', with: 'Example Description'
        select 'FTP', from: 'Protocol'
        fill_in 'Mime Type', with: 'text/html'
        fill_in 'Caption', with: 'Example Caption'
        fill_in 'Title', with: 'Example Title'
        within '.file-size' do
          fill_in 'Size', with: '42'
          fill_in 'Unit', with: 'MB'
        end
        within '.content-type' do
          fill_in 'Type', with: 'Type'
          fill_in 'Subtype', with: 'Subtype'
        end

        unless single
          # Add another RelatedUrl
          click_on 'Add another Related Url'

          within '.multiple-item-1' do
            within '.multiple.related-url-url' do
              within '.multiple-item-0' do
                find('.url').set 'http://example.com/1'
              end
            end
          end
        end
      end
    end

    def add_resource_citation
      within '.multiple.resource-citations' do
        fill_in 'Version', with: 'v1'
        fill_in 'draft_collection_citations_0_title', with: 'Citation title' # Title
        fill_in 'Creator', with: 'Citation creator'
        fill_in 'Editor', with: 'Citation editor'
        fill_in 'Series Name', with: 'Citation series name'
        fill_in 'Release Date', with: '2015-07-01T00:00:00Z'
        fill_in 'Release Place', with: 'Citation release place'
        fill_in 'Publisher', with: 'Citation publisher'
        fill_in 'Issue Identification', with: 'Citation issue identification'
        fill_in 'Data Presentation Form', with: 'Citation data presentation form'
        fill_in 'Other Citation Details', with: 'Citation other details'
        fill_in 'DOI', with: 'Citation DOI'
        fill_in 'Authority', with: 'Citation DOI Authority'
        add_related_urls(true)

        click_on 'Add another Resource Citation'
        within '.multiple-item-1' do
          fill_in 'Version', with: 'v2'
          fill_in 'draft_collection_citations_1_title', with: 'Citation title 1' # Title
          fill_in 'Creator', with: 'Citation creator 1'
          add_related_urls(true)
        end
      end
    end

    def add_metadata_association
      within '.multiple.metadata-associations' do
        select 'Science Associated', from: 'Type'
        fill_in 'Description', with: 'Metadata association description'
        fill_in 'Entry Id', with: '12345'
        click_on 'Add another Metadata Association'
        within '.multiple-item-1' do
          select 'Larger Citation Works', from: 'Type'
          fill_in 'Entry Id', with: '123abc'
        end
      end
    end

    def add_publication_reference
      within '.multiple.publication-references' do
        fill_in 'draft_publication_references_0_title', with: 'Publication reference title' # Title
        fill_in 'Publisher', with: 'Publication reference publisher'
        fill_in 'DOI', with: 'Publication reference DOI'
        fill_in 'Authority', with: 'Publication reference authority'
        fill_in 'Author', with: 'Publication reference author'
        fill_in 'Publication Date', with: '2015-07-01T00:00:00Z'
        fill_in 'Series', with: 'Publication reference series'
        fill_in 'Edition', with: 'Publication reference edition'
        fill_in 'Volume', with: 'Publication reference volume'
        fill_in 'Issue', with: 'Publication reference issue'
        fill_in 'Report Number', with: 'Publication reference report number'
        fill_in 'Publication Place', with: 'Publication reference publication place'
        fill_in 'Pages', with: 'Publication reference pages'
        fill_in 'ISBN', with: '1234567890123'
        fill_in 'Other Reference Details', with: 'Publication reference details'
        add_related_urls(true)

        click_on 'Add another Publication Reference'
        within '.multiple-item-1' do
          fill_in 'draft_publication_references_1_title', with: 'Publication reference title 1' # Title
          fill_in 'ISBN', with: '9876543210987'
        end
      end
    end

    def add_platforms
      within '.multiple.platforms' do
        fill_in 'Type', with: 'Platform type'
        fill_in 'draft_platforms_0_short_name', with: 'Platform short name'
        fill_in 'draft_platforms_0_long_name', with: 'Platform long name'
        add_characteristics
        add_instruments

        click_on 'Add another Platform'
        within '.multiple-item-1' do
          fill_in 'draft_platforms_1_short_name', with: 'Platform short name 1'
          add_instruments('1')
        end
      end
    end

    def add_characteristics
      within first('.multiple.characteristics') do
        fill_in 'Name', with: 'Characteristics name'
        fill_in 'Description', with: 'Characteristics description'
        fill_in 'Value', with: 'Characteristics value'
        fill_in 'Unit', with: 'unit'
        fill_in 'Data Type', with: 'Characteristics data type'

        click_on 'Add another Characteristic'
        within '.multiple-item-1' do
          fill_in 'Name', with: 'Characteristics name 1'
          fill_in 'Description', with: 'Characteristics description 1'
          fill_in 'Value', with: 'Characteristics value 1'
          fill_in 'Unit', with: 'unit 1'
          fill_in 'Data Type', with: 'Characteristics data type 1'
        end
      end
    end

    def add_instruments(platform = '0')
      within '.multiple.instruments' do
        fill_in "draft_platforms_#{platform}_instruments_0_short_name", with: 'Instrument short name'
        fill_in "draft_platforms_#{platform}_instruments_0_long_name", with: 'Instrument long name'
        fill_in "draft_platforms_#{platform}_instruments_0_technique", with: 'Instrument technique'
        fill_in 'Number Of Sensors', with: 2468
        within '.multiple.operational-mode' do
          within '.multiple-item-0' do
            find('.operational-mode').set 'Instrument mode 1'
            click_on 'Add another Operational Mode'
          end
          within '.multiple-item-1' do
            find('.operational-mode').set 'Instrument mode 2'
          end
        end

        add_characteristics
        add_sensors(platform)

        click_on 'Add another Instrument'
        within '.multiple-item-1' do
          fill_in "draft_platforms_#{platform}_instruments_1_short_name", with: 'Instrument short name 1'
        end
      end
    end

    def add_sensors(platform)
      within '.multiple.sensors' do
        fill_in "draft_platforms_#{platform}_instruments_0_sensors_0_short_name", with: 'Sensor short name'
        fill_in "draft_platforms_#{platform}_instruments_0_sensors_0_long_name", with: 'Sensor long name'
        fill_in "draft_platforms_#{platform}_instruments_0_sensors_0_technique", with: 'Sensor technique'
        add_characteristics

        click_on 'Add another Sensor'
        within '.multiple-item-1' do
          fill_in "draft_platforms_#{platform}_instruments_0_sensors_1_short_name", with: 'Sensor short name 1'
        end
      end
    end

    def add_points
      script = '$(".geometry-picker.points").click();'
      page.execute_script script

      within first('.multiple.points') do
        fill_in 'Longitude', with: '-77.047878'
        fill_in 'Latitude', with: '38.805407'
        click_on 'Add another Point'
        within '.multiple-item-1' do
          fill_in 'Longitude', with: '-76.9284587'
          fill_in 'Latitude', with: '38.968602'
        end
      end
    end

    def add_bounding_rectangles
      script = '$(".geometry-picker.bounding-rectangles").click();'
      page.execute_script script

      within first('.multiple.bounding-rectangles') do
        fill_in 'Longitude', with: '0.0'
        fill_in 'Latitude', with: '0.0'
        fill_in 'West Bounding Coordinate', with: '-180.0'
        fill_in 'North Bounding Coordinate', with: '90.0'
        fill_in 'East Bounding Coordinate', with: '180.0'
        fill_in 'South Bounding Coordinate', with: '-90.0'
        click_on 'Add another Bounding Rectangle'
        within '.multiple-item-1' do
          fill_in 'West Bounding Coordinate', with: '-96.9284587'
          fill_in 'North Bounding Coordinate', with: '58.968602'
          fill_in 'East Bounding Coordinate', with: '-56.9284587'
          fill_in 'South Bounding Coordinate', with: '18.968602'
        end
      end
    end

    def add_g_polygons
      script = '$(".geometry-picker.g-polygons").click();'
      page.execute_script script

      within first('.multiple.g-polygons') do
        within '.point' do
          fill_in 'Longitude', with: '0.0'
          fill_in 'Latitude', with: '0.0'
        end
        within '.boundary .multiple.points' do
          fill_in 'Longitude', with: '10.0'
          fill_in 'Latitude', with: '10.0'
          click_on 'Add another Point'
          within '.multiple-item-1' do
            fill_in 'Longitude', with: '-10.0'
            fill_in 'Latitude', with: '10.0'
          end
          click_on 'Add another Point'
          within '.multiple-item-2' do
            fill_in 'Longitude', with: '-10.0'
            fill_in 'Latitude', with: '-10.0'
          end
          click_on 'Add another Point'
          within '.multiple-item-3' do
            fill_in 'Longitude', with: '10.0'
            fill_in 'Latitude', with: '-10.0'
          end
        end
        within '.exclusive-zone' do
          within '.multiple.boundaries' do
            fill_in 'Longitude', with: '5.0'
            fill_in 'Latitude', with: '5.0'
            click_on 'Add another Point'
            within '.multiple-item-1' do
              fill_in 'Longitude', with: '-5.0'
              fill_in 'Latitude', with: '5.0'
            end
            click_on 'Add another Point'
            within '.multiple-item-2' do
              fill_in 'Longitude', with: '-5.0'
              fill_in 'Latitude', with: '-5.0'
            end
            click_on 'Add another Point'
            within '.multiple-item-3' do
              fill_in 'Longitude', with: '5.0'
              fill_in 'Latitude', with: '-5.0'
            end
          end
        end

        click_on 'Add another G Polygon'
        within all('.multiple-item-1').last do
          within '.boundary .multiple.points' do
            fill_in 'Longitude', with: '38.98828125'
            fill_in 'Latitude', with: '-77.044921875'
            click_on 'Add another Point'
            within '.multiple-item-1' do
              fill_in 'Longitude', with: '38.935546875'
              fill_in 'Latitude', with: '-77.1240234375'
            end
            click_on 'Add another Point'
            within '.multiple-item-2' do
              fill_in 'Longitude', with: '38.81689453125'
              fill_in 'Latitude', with: '-77.02734375'
            end
            click_on 'Add another Point'
            within '.multiple-item-3' do
              fill_in 'Longitude', with: '38.900390625'
              fill_in 'Latitude', with: '-76.9130859375'
            end
          end
        end
      end
    end

    def add_lines
      script = '$(".geometry-picker.lines").click();'
      page.execute_script script

      within first('.multiple.lines') do
        within '.point' do
          fill_in 'Longitude', with: '25.0'
          fill_in 'Latitude', with: '25.0'
        end
        within '.multiple.points' do
          fill_in 'Longitude', with: '24.0'
          fill_in 'Latitude', with: '24.0'
          click_on 'Add another Point'
          within '.multiple-item-1' do
            fill_in 'Longitude', with: '26.0'
            fill_in 'Latitude', with: '26.0'
          end
        end
        click_on 'Add another Line'
        within all('.multiple-item-1').last do
          within '.point' do
            fill_in 'Longitude', with: '25.0'
            fill_in 'Latitude', with: '25.0'
          end
          within '.multiple.points' do
            fill_in 'Longitude', with: '24.0'
            fill_in 'Latitude', with: '26.0'
            click_on 'Add another Point'
            within '.multiple-item-1' do
              fill_in 'Longitude', with: '26.0'
              fill_in 'Latitude', with: '24.0'
            end
          end
        end
      end
    end

    def upload_shapefile(path)
      script = "$('.dz-hidden-input').attr('id', 'shapefile');"
      page.execute_script(script)

      attach_file('shapefile', Rails.root.join(path))
      sleep 1
    end

    def add_science_keywords
      choose_keyword 'EARTH SCIENCE SERVICES'
      choose_keyword 'DATA ANALYSIS AND VISUALIZATION'
      choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
      click_on 'Add Keyword'

      choose_keyword 'EARTH SCIENCE SERVICES'
      choose_keyword 'DATA ANALYSIS AND VISUALIZATION'
      choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
      choose_keyword 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
      choose_keyword 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
      click_on 'Add Keyword'
    end

    def add_spatial_keywords
      choose_keyword 'GEOGRAPHIC REGION'
      choose_keyword 'ARCTIC'
      click_on 'Add Keyword'

      choose_keyword 'OCEAN'
      choose_keyword 'ATLANTIC OCEAN'
      click_on 'Add Keyword'
    end

    def choose_keyword(text)
      script = "$('.item-list-pane li:contains(#{text}) > a').click()"
      page.execute_script(script)
    end
  end
end

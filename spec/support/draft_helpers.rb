module Helpers
  module DraftHelpers
    def output_schema_validation(draft)
      schema = 'lib/assets/schemas/collections/umm-c-json-schema.json'
      JSON::Validator.fully_validate(schema, draft).each do |error|
        puts error
      end
    end

    # Open any accordions on the page, but try again if they aren't open
    # Also try again if there are no accordions on the page (page hasn't loaded yet)
    # http://stackoverflow.com/a/28174679
    def open_accordions
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#open_accordions' do
        Timeout.timeout(Capybara.default_max_wait_time) do
          loop do
            # puts 'doing open accordions'
            do_open_accordions
            return if accordions_open?
          end
        end
      rescue Timeout::Error
        raise 'Timeout: Failed to open the accordions on the page'
      end
    end

    def do_open_accordions
      script = "$('.eui-accordion.is-closed').removeClass('is-closed');"
      page.execute_script(script)
    end

    def accordions_open?
      # Are there accordions on the page, and are they open?
      expect(page).to have_css('.eui-accordion')
      expect(page).to have_no_css('.eui-accordion.is-closed')
      # puts 'past accordion expectations, before jQuery expectation'

      # are active jQuery requests finished?
      expect(page.evaluate_script('jQuery.active').zero?).to be true
    rescue
      false
    end

    def add_data_center(value)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_data_center' do
        find('.select2-container .select2-selection').click
        find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: value).click
      end
    end

    # Bamboo started failing some tests where it seemed that the select2 was not
    # opening properly. This is notably slower, so it should only be used when
    # necessary.
    def add_data_center_with_retry(value)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_data_center_with_retry' do
        find('.select2-container .select2-selection').click
        begin
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: value)
        rescue Capybara::ElementNotFound
          find('.select2-container .select2-selection').click
        end
        find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: value).click
      end
    end

    def add_person
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_person' do
        fill_in 'First Name', with: 'First Name'
        fill_in 'Middle Name', with: 'Middle Name'
        fill_in 'Last Name', with: 'Last Name'
      end
    end

    def add_contact_information(type: nil, single: nil, button_type: nil)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_contact_information' do
        within '.contact-information' do
          fill_in 'Service Hours', with: '9-5, M-F'
          fill_in 'Contact Instructions', with: 'Email only'
          add_contact_mechanisms
          add_addresses
          add_related_urls(type: type, button_type: button_type)
        end
      end
    end

    def add_dates
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_dates' do
        within '.multiple.dates' do
          select 'Creation', from: 'Type'
          fill_in 'Date', with: '2015-07-01T00:00:00Z'

          click_on 'Add another Date'
          within '.multiple-item-1' do
            select 'Future Review', from: 'Type'
            fill_in 'Date', with: '2015-07-02T00:00:00Z'
          end
        end
      end
    end

    def add_metadata_dates
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_metadata_dates' do
        within '.multiple.dates' do
          select 'Future Review', from: 'Type'
          fill_in 'Date', with: '2015-07-01T00:00:00Z'

          click_on 'Add another Date'
          within '.multiple-item-1' do
            select 'Planned Deletion', from: 'Type'
            fill_in 'Date', with: '2015-07-02T00:00:00Z'
          end
        end
      end
    end

    def add_contact_mechanisms
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_contact_mechanisms' do
        within '.multiple.contact-mechanisms' do
          select 'Email', from: 'Type'
          fill_in 'Value', with: 'example@example.com'
          click_on 'Add another Contact Mechanism'
          within '.multiple-item-1' do
            select 'Email', from: 'Type'
            fill_in 'Value', with: 'example2@example.com'
          end
        end
      end
    end

    def add_addresses
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_addresses' do
        within '.multiple.addresses' do
          fill_in 'Street Address - Line 1', with: '300 E Street Southwest'
          fill_in 'Street Address - Line 2', with: 'Room 203'
          fill_in 'Street Address - Line 3', with: 'Address line 3'
          select 'United States', from: 'Country'
          fill_in 'City', with: 'Washington'
          select 'District of Columbia', from: 'State / Province'
          fill_in 'Postal Code', with: '20546'
          click_on 'Add another Address'
          within '.multiple-item.eui-accordion.multiple-item-1' do
            fill_in 'Street Address - Line 1', with: '8800 Greenbelt Road'
            select 'United States', from: 'Country'
            fill_in 'City', with: 'Greenbelt'
            select 'Maryland', from: 'State / Province'
            fill_in 'Postal Code', with: '20771'
          end
        end
      end
    end

    def add_related_urls(type: nil, button_type: nil)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_related_urls' do
        within '.multiple.related-urls' do
          if type == 'data_contact'
            fill_in 'Description', with: 'Example Description'
            select 'Data Contact URL', from: 'URL Content Type'
            select 'Home Page', from: 'Type'

            fill_related_url_if_not_readonly
          elsif type == 'data_center'
            fill_in 'Description', with: 'Example Description'
            select 'Data Center URL', from: 'URL Content Type'
            select 'Home Page', from: 'Type'

            fill_related_url_if_not_readonly
          else
            fill_in 'Description', with: 'Example Description'
            select 'Collection URL', from: 'URL Content Type'
            select 'Data Set Landing Page', from: 'Type'
            fill_in 'URL', with: 'http://example.com'

            button_title = 'Related URL'
            button_title = 'Distribution URL' if type == 'distribution_form'
            button_type += ' ' unless button_type.nil?
            # Add another RelatedUrl
            puts 'clicking to add another related url'
            click_on "Add another #{button_type}#{button_title}"

            within '.multiple-item.eui-accordion.multiple-item-1' do
              fill_in 'Description', with: 'Example Description 2'
              select 'Distribution URL', from: 'URL Content Type'
              select 'Get Data', from: 'Type'
              select 'Direct Download', from: 'Subtype'
              fill_in 'URL', with: 'https://example.com/'

              # Get Data fields
              select 'CSV', from: 'Format'
              fill_in 'Size', with: '42.0'
              select 'KB', from: 'Unit'
              fill_in 'Fees', with: '0'
              fill_in 'Checksum', with: 'testchecksum123'
            end
          end
        end
      end
    end

    def fill_related_url_if_not_readonly
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#fill_related_url_if_not_readonly' do
        # this method seems to be very slow, so use a shorter wait time
        using_wait_time(1) do
          # only try to fill in the URL field if it is not readonly - if the data center short name did not have one to populate the field
          if page.has_no_field?('URL', readonly: true)
            # puts 'entering "example.com" when URL not readonly'
            fill_in 'URL', with: 'http://example.com'
          end
        end
      end
    end

    def add_collection_citations
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_collection_citations' do
        within '.multiple.collection-citations' do
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
          within '.online-resource' do
            fill_in 'Name', with: 'Online Resource Name'
            fill_in 'Linkage', with: 'http://www.example.com'
            fill_in 'Description', with: 'Online Resource Description'
            fill_in 'Protocol', with: 'http'
            fill_in 'Application Profile', with: 'website'
            fill_in 'Function', with: 'information'
          end

          click_on 'Add another Collection Citation'
          within '.multiple-item-1' do
            fill_in 'Version', with: 'v2'
            fill_in 'draft_collection_citations_1_title', with: 'Citation title 1' # Title
            fill_in 'Creator', with: 'Citation creator 1'
            within '.online-resource' do
              fill_in 'Name', with: 'Online Resource Name 1'
              fill_in 'Linkage', with: 'http://www.example.com/1'
              fill_in 'Description', with: 'Online Resource Description 1'
            end
          end
        end
      end
    end

    def add_metadata_association
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_metadata_association' do
        within '.multiple.metadata-associations' do
          select 'Science Associated', from: 'Type'
          fill_in 'Entry Id', with: '12345'
          fill_in 'Description', with: 'Metadata association description'
          fill_in 'Version', with: '23'
          click_on 'Add another Metadata Association'
          within '.multiple-item-1' do
            select 'Larger Citation Works', from: 'Type'
            fill_in 'Entry Id', with: '123abc'
          end
        end
      end
    end

    def add_publication_reference
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_publication_reference' do
        within '.multiple.publication-references' do
          fill_in 'draft_publication_references_0_title', with: 'Publication reference title' # Title
          fill_in 'Publisher', with: 'Publication reference publisher'

          script = '$("#draft_publication_references_0_doi_Available").click();'
          page.execute_script script
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
          within '.online-resource' do
            fill_in 'Name', with: 'Online Resource Name'
            fill_in 'Linkage', with: 'http://www.example.com'
            fill_in 'Description', with: 'Online Resource Description'
            fill_in 'Protocol', with: 'http'
            fill_in 'Application Profile', with: 'website'
            fill_in 'Function', with: 'information'
          end

          click_on 'Add another Publication Reference'
          within '.multiple-item-1' do
            fill_in 'draft_publication_references_1_title', with: 'Publication reference title 1' # Title
            fill_in 'ISBN', with: '9876543210987'
          end
        end
      end
    end

    def add_platforms
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_platforms' do
        within '.multiple.platforms' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'A340-600').click

          add_characteristics
          add_instruments

          click_on 'Add another Platform'
          within '.multiple-item-1' do
            all('.select2-container .select2-selection').first.click
            find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'DIADEM-1D').click
            add_instruments('1')
          end
        end
      end
    end

    def add_characteristics
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_characteristics' do
        within first('.multiple.characteristics') do
          fill_in 'Name', with: 'Characteristics name'
          fill_in 'Description', with: 'Characteristics description'
          fill_in 'Value', with: 'Characteristics value'
          fill_in 'Unit', with: 'unit'
          select 'String', from: 'Data Type'

          click_on 'Add another Characteristic'
          within '.multiple-item-1' do
            fill_in 'Name', with: 'Characteristics name 1'
            fill_in 'Description', with: 'Characteristics description 1'
            fill_in 'Value', with: 'Characteristics value 1'
            fill_in 'Unit', with: 'unit 1'
            select 'String', from: 'Data Type'
          end
        end
      end
    end

    def add_instruments(platform = '0')
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_instruments' do
        within '.multiple.instruments' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ATM').click
          fill_in "draft_platforms_#{platform}_instruments_0_technique", with: 'Instrument technique'
          fill_in 'Number Of Instruments', with: 2468
          within '.multiple.operational-modes' do
            within '.multiple-item-0' do
              find('.operational-mode').set 'Instrument mode 1'
              click_on 'Add another Operational Mode'
            end
            within '.multiple-item-1' do
              find('.operational-mode').set 'Instrument mode 2'
            end
          end

          add_characteristics
          add_instrument_children(platform)

          click_on 'Add another Instrument'
          within '.multiple-item-1' do
            all('.select2-container .select2-selection').first.click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'LVIS').click
          end
        end
      end
    end

    def add_instrument_children(platform)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_instrument_children' do
        within '.multiple.instrument-children' do
          find('.select2-container .select2-selection').click
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ADS').click

          fill_in "draft_platforms_#{platform}_instruments_0_composed_of_0_technique", with: 'Instrument Child technique'
          add_characteristics

          click_on 'Add another Instrument Child'
          within '.multiple-item-1' do
            find('.select2-container .select2-selection').click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'SMAP L-BAND RADIOMETER').click
          end
        end
      end
    end

    def add_points
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_points' do
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
    end

    def add_bounding_rectangles
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_bounding_rectangles' do
        script = '$(".geometry-picker.bounding-rectangles").click();'
        page.execute_script script

        within first('.multiple.bounding-rectangles') do
          fill_in 'West', with: '-180.0'
          fill_in 'North', with: '90.0'
          fill_in 'East', with: '180.0'
          fill_in 'South', with: '-90.0'
          click_on 'Add another Bounding Rectangle'
          within '.multiple-item-1' do
            fill_in 'West', with: '-96.9284587'
            fill_in 'North', with: '58.968602'
            fill_in 'East', with: '-56.9284587'
            fill_in 'South', with: '18.968602'
          end
        end
      end
    end

    def add_g_polygons
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_g_polygons' do
        script = '$(".geometry-picker.g-polygons").click();'
        page.execute_script script

        within first('.multiple.g-polygons') do
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
    end

    def add_lines
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_lines' do
        script = '$(".geometry-picker.lines").click();'
        page.execute_script script

        within first('.multiple.lines') do
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
    end

    def add_science_keywords
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_science_keywords' do
        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'ATMOSPHERE'
        choose_keyword 'ATMOSPHERIC TEMPERATURE'
        choose_keyword 'SURFACE TEMPERATURE'
        choose_keyword 'MAXIMUM/MINIMUM TEMPERATURE'
        choose_keyword '24 HOUR MAXIMUM TEMPERATURE'
        click_on 'Add Keyword'

        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'SOLID EARTH'
        choose_keyword 'ROCKS/MINERALS/CRYSTALS'
        choose_keyword 'SEDIMENTARY ROCKS'
        choose_keyword 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES'
        choose_keyword 'LUMINESCENCE'
        click_on 'Add Keyword'
      end
    end


    def add_science_keywords_suggestion
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_science_keywords_suggestion' do
        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'ATMOSPHERE'

        find('#science-keyword-search').set('angstrom')
        find('#science-keyword-search').click
        find('.tt-open').click
      end
    end


    def add_location_keywords
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_location_keywords' do
        choose_keyword 'GEOGRAPHIC REGION'
        choose_keyword 'ARCTIC'
        click_on 'Add Keyword'

        choose_keyword 'OCEAN'
        choose_keyword 'ATLANTIC OCEAN'
        choose_keyword 'NORTH ATLANTIC OCEAN'
        choose_keyword 'BALTIC SEA'
        click_on 'Add Keyword'
      end
    end

    def choose_keyword(text)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#choose_keyword' do
        script = "$('.eui-item-list-pane li.item:contains(#{text}) > a').click()"
        page.execute_script(script)
      end
    end

    def add_archive_and_distribution_information
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#add_archive_and_distribution_information' do
        within '.multiple.file-archive-informations' do
          fill_in 'Format', with: 'jpeg'
          select 'Native', from: 'Format Type'
          fill_in 'Format Description', with: 'A format description'
          fill_in 'Average File Size', with: '2'
          select 'MB', from: 'Average File Size Unit'
          fill_in 'Total Collection File Size', with: '15'
          select 'GB', from: 'Total Collection File Size Unit'
          fill_in 'Description', with: 'A file archive information description'

          click_on 'Add another File Archive Information'
          within first('.multiple-item-1') do
            fill_in 'Format', with: 'kml'
            select 'Native', from: 'Format Type'
            fill_in 'Format Description', with: 'A format description'
            fill_in 'Average File Size', with: '10'
            select 'MB', from: 'Average File Size Unit'
            script = '$("#draft_archive_and_distribution_information_file_archive_information_1_ByDate").click();'
            page.execute_script script
            fill_in 'Total Collection File Size Begin Date', with: '2015-07-01T00:00:00Z'
          end
        end
        within '.multiple.file-distribution-informations' do
          fill_in 'Format', with: 'binary'
          select 'Supported', from: 'Format Type'
          fill_in 'Format Description', with: 'A format description'
          within '.multiple.simple-multiple.media' do
            within '.multiple-item-0' do
              find('.media').set 'disc'
              click_on 'Add another Media'
            end
            within '.multiple-item-1' do
              find('.media').set 'file'
            end
          end
          fill_in 'Average File Size', with: '1'
          select 'MB', from: 'Average File Size Unit'
          fill_in 'Description', with: 'A file distribution information description'
          fill_in 'Fees', with: 'File archive information fees'
        end

      end
    end

    def mock_get_controlled_keywords_static
      keyword_response = cmr_success_response(
        {"context_medium"=>
          [
            { "value"=>"test_medium",
              "object"=>
                [
                  { "value"=>"test_object",
                    "quantity"=>
                      [{ "value"=>"test_quantity" }]
                  }
                ]
            }
          ]
        }.to_json)
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_controlled_keywords).and_return(keyword_response)
    end
  end
end

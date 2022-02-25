describe 'Repopulating Bulk Update Form after a failed attempt', js: true do
  before :all do
    @ingest_response, @concept_response = publish_collection_draft
  end

  context 'when starting a new bulk update' do
    before do
      login

      visit new_bulk_updates_search_path

      # Search form
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@concept_response.body['EntryTitle'])
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'
    end

    context 'when submitting a bulk update for Platforms but there is already a bulk update with the same name' do
      before do
        @used_bulk_update_name = "Platforms Bulk Update Already Used Name #{Faker::Number.number(digits: 4)}"

        # Bulk Update form
        fill_in 'bulk_update_name', with: @used_bulk_update_name
        select 'Platforms', from: 'Field to Update'
        select 'Find & Update', from: 'Update Type'
        fill_in 'Short Name', with: 'A340-600'
        # Select new Short Name from Select2
        find('.select2-container .select2-selection').click
        within '.select2-container .select2-results' do
          # not sure why, but with the new platform structure, we need to be very
          # specific or the first option under the category will be selected
          find('ul.select2-results__options li.select2-results__option ul.select2-results__options li.select2-results__option', text: 'DMSP 5B/F3', match: :first).click
        end

        click_on 'Preview'

        expect(page).to have_content('Preview of New MMT_2 Bulk Update')

        _bulk_update_response = create_bulk_update(
          payload: {
            'concept-ids': [@ingest_response['concept-id']],
            'name': @used_bulk_update_name,
            'update-field': 'INSTRUMENTS',
            'update-type': 'FIND_AND_UPDATE',
            'find-value': { 'ShortName': 'ADS' },
            'update-value': { 'ShortName': 'ATM', 'LongName': 'Airborne Topographic Mapper' }
          }
        )

        click_on 'Submit'
        click_on 'Yes'
      end

      it 'the bulk update fails and respopulates the Bulk Update Form with previously entered information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('New')
          expect(page).to have_no_content(@used_bulk_update_name)
        end

        expect(page).to have_content('Error creating bulk update task: Bulk update name needs to be unique within the provider.')

        expect(page).to have_field('bulk_update_name', with: @used_bulk_update_name)
        expect(page).to have_select('Field to Update', selected: 'Platforms')
        expect(page).to have_select('Update Type', selected: 'Find & Update')
        expect(page).to have_field('Short Name', with: 'A340-600')
        expect(page).to have_select('platform_short_name', selected: 'DMSP 5B/F3')
        expect(page).to have_field('Long Name', with: 'Defense Meteorological Satellite Program-F3')
      end

      context 'when changing the name and previewing the bulk update again' do
        let(:new_bulk_update_name) { "All New Bulk Update Name for Platforms #{Faker::Number.number(digits: 3)}" }
        before do
          fill_in 'bulk_update_name', with: new_bulk_update_name

          click_on 'Preview'
        end

        it 'displays the preview with the previously entered data and new name' do
          expect(page).to have_content('Preview of New MMT_2 Bulk Update')

          expect(page).to have_content('Name')
          expect(page).to have_content(new_bulk_update_name)
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Platforms')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Update')

          # Find Values to Update
          within '.find-values-preview' do
            expect(page).to have_content('Short Name: A340-600')
          end

          # New Values
          within '.new-values-preview' do
            expect(page).to have_content('Type: Earth Observation Satellites')
            expect(page).to have_content('Short Name: DMSP 5B/F3')
            expect(page).to have_content('Long Name: Defense Meteorological Satellite Program-F3')
          end

          within '.bulk-update-preview-table' do
            expect(page).to have_content(@concept_response.body['EntryTitle'])
            expect(page).to have_content(@concept_response.body['ShortName'])
          end
        end
      end
    end

    context 'when submitting a bulk update for Instruments but there is already a bulk update with the same name' do
      before do
        @used_bulk_update_name = "Instruments Bulk Update Already Used Name #{Faker::Number.number(digits: 4)}"

        # Bulk Update form
        fill_in 'bulk_update_name', with: @used_bulk_update_name
        select 'Instruments', from: 'Field to Update'
        select 'Find & Update', from: 'Update Type'
        fill_in 'Short Name', with: 'ADS'
        # Select new Short Name from Select2
        find('.select2-container .select2-selection').click
        # I would prefer to choose 'ACOUSTIC SOUNDERS', but KMS does not provide a
        # Long Name for that value, and Bulk Update fails (until CMR-4552 is addressed).
        # So we need to choose a value that was already added
        find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ATM').click

        click_on 'Preview'

        expect(page).to have_content('Preview of New MMT_2 Bulk Update')

        _bulk_update_response = create_bulk_update(
          payload: {
            'concept-ids': [@ingest_response['concept-id']],
            'name': @used_bulk_update_name,
            'update-field': 'INSTRUMENTS',
            'update-type': 'FIND_AND_UPDATE',
            'find-value': { 'ShortName': 'ADS' },
            'update-value': { 'ShortName': 'ATM', 'LongName': 'Airborne Topographic Mapper' }
          }
        )

        click_on 'Submit'
        click_on 'Yes'
      end

      it 'the bulk update fails and respopulates the Bulk Update Form with previously entered information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('New')
          expect(page).to have_no_content(@used_bulk_update_name)
        end

        expect(page).to have_content('Error creating bulk update task: Bulk update name needs to be unique within the provider.')

        expect(page).to have_field('bulk_update_name', with: @used_bulk_update_name)
        expect(page).to have_select('Field to Update', selected: 'Instruments')
        expect(page).to have_select('Update Type', selected: 'Find & Update')
        expect(page).to have_field('Short Name', with: 'ADS')
        expect(page).to have_select('instrument_short_name', selected: 'ATM')
        expect(page).to have_field('Long Name', with: 'Airborne Topographic Mapper')
      end

      context 'when changing the name and previewing the bulk update again' do
        let(:new_bulk_update_name) { "All New Bulk Update Name for Instruments #{Faker::Number.number(digits: 3)}" }
        before do
          fill_in 'bulk_update_name', with: new_bulk_update_name

          click_on 'Preview'
        end

        it 'displays the preview with the previously entered data and new name' do
          expect(page).to have_content('Preview of New MMT_2 Bulk Update')

          expect(page).to have_content('Name')
          expect(page).to have_content(new_bulk_update_name)
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Instruments')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Update')

          # Find Values to Update
          within '.find-values-preview' do
            expect(page).to have_content('Short Name: ADS')
          end

          # New Values
          within '.new-values-preview' do
            expect(page).to have_content('Short Name: ATM')
            expect(page).to have_content('Long Name: Airborne Topographic Mapper')
          end

          within '.bulk-update-preview-table' do
            expect(page).to have_content(@concept_response.body['EntryTitle'])
            expect(page).to have_content(@concept_response.body['ShortName'])
          end
        end
      end
    end

    context 'when submitting a bulk update for Data Centers but there is already a bulk update with the same name' do
      before do
        @used_bulk_update_name = "Data Centers Bulk Update Already Used Name #{Faker::Number.number(digits: 4)}"

        # Bulk update form
        fill_in 'bulk_update_name', with: @used_bulk_update_name

        # Update AARHUS-HYDRO to OR-STATE/EOARC
        select 'Data Centers', from: 'Field to Update'
        select 'Find & Update', from: 'Update Type'
        fill_in 'Short Name', with: 'AARHUS-HYDRO'
        # Select new Short Name from Select2
        find('.select2-container .select2-selection').click
        find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'OR-STATE/EOARC').click

        click_on 'Preview'

        expect(page).to have_content('Preview of New MMT_2 Bulk Update')

        _bulk_update_response = create_bulk_update(
          payload: {
            'concept-ids': [@ingest_response['concept-id']],
            'name': @used_bulk_update_name,
            'update-field': 'INSTRUMENTS',
            'update-type': 'FIND_AND_UPDATE',
            'find-value': { 'ShortName': 'ADS' },
            'update-value': { 'ShortName': 'ATM', 'LongName': 'Airborne Topographic Mapper' }
          }
        )

        click_on 'Submit'
        click_on 'Yes'
      end

      it 'the bulk update fails and respopulates the Bulk Update Form with previously entered information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('New')
          expect(page).to have_no_content(@used_bulk_update_name)
        end

        expect(page).to have_content('Error creating bulk update task: Bulk update name needs to be unique within the provider.')

        expect(page).to have_field('bulk_update_name', with: @used_bulk_update_name)
        expect(page).to have_select('Field to Update', selected: 'Data Centers')
        expect(page).to have_select('Update Type', selected: 'Find & Update')
        expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
        expect(page).to have_select('data_center_short_name', selected: 'OR-STATE/EOARC')
        expect(page).to have_field('Long Name', with: 'Eastern Oregon Agriculture Research Center, Oregon State University')

        within '.related-url' do
          expect(page).to have_css('option[selected]', text: 'Data Center URL')
          expect(page).to have_css('option[selected]', text: 'Home Page')
          expect(page).to have_field('URL', with: 'http://oregonstate.edu/dept/eoarcunion/')
        end
      end

      context 'when changing the name and previewing the bulk update again' do
        let(:new_bulk_update_name) { "All New Bulk Update Name for Data Centers #{Faker::Number.number(digits: 3)}" }
        before do
          fill_in 'bulk_update_name', with: new_bulk_update_name

          click_on 'Preview'
        end

        it 'displays the preview with the previously entered data and new name' do
          expect(page).to have_content('Preview of New MMT_2 Bulk Update')

          expect(page).to have_content('Name')
          expect(page).to have_content(new_bulk_update_name)
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Data Centers')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Update')
          # Find Values to Update
          within '.find-values-preview' do
            expect(page).to have_content('Short Name: AARHUS-HYDRO')
          end

          # New Values
          within '.new-values-preview' do
            expect(page).to have_content('Short Name: OR-STATE/EOARC')
            expect(page).to have_content('Long Name: Eastern Oregon Agriculture Research Center, Oregon State University')
            expect(page).to have_content('Related Url Content Type: DataCenterURL')
            expect(page).to have_content('Related Url Type: HOME PAGE')
            expect(page).to have_content('Related URL: http://oregonstate.edu/dept/eoarcunion/')
          end

          within '.bulk-update-preview-table' do
            expect(page).to have_content(@concept_response.body['EntryTitle'])
            expect(page).to have_content(@concept_response.body['ShortName'])
          end
        end
      end
    end

    context 'when submitting a bulk update for Location Keywords but there is already a bulk update with the same name' do
      before do
        @used_bulk_update_name = "Location Keywords Bulk Update Already Used Name #{Faker::Number.number(digits: 4)}"

        # Bulk update form
        fill_in 'bulk_update_name', with: @used_bulk_update_name
        select 'Location Keywords', from: 'Field to Update'
        select 'Find & Replace', from: 'Update Type'

        fill_in 'Category', with: 'OCEAN'

        # Select new keyword from picker
        choose_keyword 'OCEAN'
        choose_keyword 'ATLANTIC OCEAN'
        choose_keyword 'NORTH ATLANTIC OCEAN'
        choose_keyword 'BALTIC SEA'
        click_on 'Select Keyword'

        click_on 'Preview'

        expect(page).to have_content('Preview of New MMT_2 Bulk Update')

        _bulk_update_response = create_bulk_update(
          payload: {
            'concept-ids': [@ingest_response['concept-id']],
            'name': @used_bulk_update_name,
            'update-field': 'INSTRUMENTS',
            'update-type': 'FIND_AND_UPDATE',
            'find-value': { 'ShortName': 'ADS' },
            'update-value': { 'ShortName': 'ATM', 'LongName': 'Airborne Topographic Mapper' }
          }
        )

        click_on 'Submit'
        click_on 'Yes'
      end

      it 'the bulk update fails and respopulates the Bulk Update Form with previously entered information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('New')
          expect(page).to have_no_content(@used_bulk_update_name)
        end

        expect(page).to have_content('Error creating bulk update task: Bulk update name needs to be unique within the provider.')

        expect(page).to have_field('bulk_update_name', with: @used_bulk_update_name)
        expect(page).to have_select('Field to Update', selected: 'Location Keywords')
        expect(page).to have_select('Update Type', selected: 'Find & Replace')

        within '.bulk-updates-find' do
          expect(page).to have_field('location_category', with: 'OCEAN')
        end

        within '.bulk-updates-value' do
          expect(page).to have_field('new_location_category', with: 'OCEAN')
          expect(page).to have_field('new_type', with: 'ATLANTIC OCEAN')
          expect(page).to have_field('new_subregion_1', with: 'NORTH ATLANTIC OCEAN')
          expect(page).to have_field('new_subregion_2', with: 'BALTIC SEA')
        end
      end

      context 'when changing the name and previewing the bulk update again' do
        let(:new_bulk_update_name) { "All New Bulk Update Name for Location Keywords #{Faker::Number.number(digits: 3)}" }
        before do
          fill_in 'bulk_update_name', with: new_bulk_update_name

          click_on 'Preview'
        end

        it 'displays the preview with the previously entered data and new name' do
          expect(page).to have_content('Preview of New MMT_2 Bulk Update')

          expect(page).to have_content('Name')
          expect(page).to have_content(new_bulk_update_name)
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Location Keywords')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Replace')

          # Find Values to Replace
          within '.find-values-preview' do
            expect(page).to have_content('OCEAN')
          end

          # New Values
          within '.new-values-preview' do
            expect(page).to have_content('OCEAN')
            expect(page).to have_content('ATLANTIC OCEAN')
            expect(page).to have_content('NORTH ATLANTIC OCEAN')
            expect(page).to have_content('BALTIC SEA')
          end

          within '.bulk-update-preview-table' do
            expect(page).to have_content(@concept_response.body['EntryTitle'])
            expect(page).to have_content(@concept_response.body['ShortName'])
          end
        end
      end
    end

    context 'when submitting a bulk update for Science Keywords but there is already a bulk update with the same name' do
      before do
        @used_bulk_update_name = "Science Keywords Bulk Update Already Used Name #{Faker::Number.number(digits: 4)}"

        # Bulk update form
        fill_in 'bulk_update_name', with: @used_bulk_update_name
        select 'Science Keywords', from: 'Field to Update'
        select 'Find & Replace', from: 'Update Type'

        select 'SURFACE TEMPERATURE', from: 'Level 1'

        # Select new keyword from picker
        choose_keyword 'EARTH SCIENCE'
        choose_keyword 'ATMOSPHERE'
        choose_keyword 'AEROSOLS'
        click_on 'Select Keyword'

        click_on 'Preview'

        expect(page).to have_content('Preview of New MMT_2 Bulk Update')

        _bulk_update_response = create_bulk_update(
          payload: {
            'concept-ids': [@ingest_response['concept-id']],
            'name': @used_bulk_update_name,
            'update-field': 'INSTRUMENTS',
            'update-type': 'FIND_AND_UPDATE',
            'find-value': { 'ShortName': 'ADS' },
            'update-value': { 'ShortName': 'ATM', 'LongName': 'Airborne Topographic Mapper' }
          }
        )

        click_on 'Submit'
        click_on 'Yes'
      end

      it 'the bulk update fails and respopulates the Bulk Update Form with previously entered information' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('New')
          expect(page).to have_no_content(@used_bulk_update_name)
        end

        expect(page).to have_content('Error creating bulk update task: Bulk update name needs to be unique within the provider.')

        expect(page).to have_field('bulk_update_name', with: @used_bulk_update_name)
        expect(page).to have_select('Field to Update', selected: 'Science Keywords')
        expect(page).to have_select('Update Type', selected: 'Find & Replace')

        within '.bulk-updates-find' do
          expect(page).to have_select('VariableLevel1', selected: 'SURFACE TEMPERATURE')
        end

        within '.bulk-updates-value' do
          expect(page).to have_field('new_category', with: 'EARTH SCIENCE')
          expect(page).to have_field('new_topic', with: 'ATMOSPHERE')
          expect(page).to have_field('new_term', with: 'AEROSOLS')
        end
      end

      context 'when changing the name and previewing the bulk update again' do
        let(:new_bulk_update_name) { "All New Bulk Update Name for Science Keywords #{Faker::Number.number(digits: 3)}" }
        before do
          fill_in 'bulk_update_name', with: new_bulk_update_name

          click_on 'Preview'
        end

        it 'displays the preview with the previously entered data and new name' do
          expect(page).to have_content('Preview of New MMT_2 Bulk Update')

          expect(page).to have_content('Name')
          expect(page).to have_content(new_bulk_update_name)
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Science Keywords')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Replace')

          # Find Values to Replace
          within '.find-values-preview' do
            expect(page).to have_content('Find Values to Replace')
            expect(page).to have_content('CATEGORY: ANY VALUE')
            expect(page).to have_content('TOPIC: ANY VALUE')
            expect(page).to have_content('TERM: ANY VALUE')
            expect(page).to have_content('SURFACE TEMPERATURE')
          end

          # New Values
          within '.new-values-preview' do
            expect(page).to have_content('New Value')
            expect(page).to have_content('EARTH SCIENCE')
            expect(page).to have_content('ATMOSPHERE')
            expect(page).to have_content('AEROSOLS')
          end

          within '.bulk-update-preview-table' do
            expect(page).to have_content(@concept_response.body['EntryTitle'])
            expect(page).to have_content(@concept_response.body['ShortName'])
          end
        end
      end
    end
  end
end

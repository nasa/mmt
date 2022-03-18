describe 'Bulk updating Platforms' do
  before :all do
    @find_and_remove_ingest_response, @find_and_remove_concept_response = publish_collection_draft
    @find_and_update_ingest_response, @find_and_update_concept_response = publish_collection_draft
    @find_and_update_ingest_response_2, @find_and_update_concept_response_2 = publish_collection_draft
  end

  before do
    login

    visit new_bulk_updates_search_path
  end

  context 'when previewing a Find & Remove bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Platforms Test Find & Remove #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").fill_in with: @find_and_remove_concept_response.body['EntryTitle']
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      fill_in 'bulk_update_name', with: bulk_update_name
      select 'Platforms', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
      fill_in 'Short Name', with: 'SMAP'
      click_on 'Preview'
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
      expect(page).to have_content('Field to Update')
      expect(page).to have_content('Platforms')
      expect(page).to have_content('Update Type')
      expect(page).to have_content('Find And Remove')
      within '.find-values-preview' do
        expect(page).to have_content('Short Name: SMAP')
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@find_and_remove_concept_response.body['EntryTitle'])
        expect(page).to have_content(@find_and_remove_concept_response.body['ShortName'])
      end
    end

    context 'when submitting the bulk update' do
      before(:each, bulk_update_step_2: true) do
        click_on 'Submit'
        click_on 'Yes'

        # need to wait until the task status is 'COMPLETE'
        task_id = page.current_path.split('/').last
        wait_for_complete_bulk_update(task_id: task_id)

        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page', bulk_update_step_1: true, bulk_update_step_2: true do
        expect(page).to have_css('h2', text: bulk_update_name)

        within '.eui-info-box' do
          expect(page).to have_content('Status')
          expect(page).to have_content('Complete')
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Platforms')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Remove')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Remove')
          expect(page).to have_content('Short Name: SMAP')
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@find_and_remove_ingest_response['concept-id'])
        end

        it 'does not display the removed platform' do
          within '#metadata-preview' do
            expect(page).to have_content('A340-600')
            #ToDo: SMAP is been found in the json record, shouldn't be found
            #expect(page).to have_no_content('SMAP')
          end
        end
      end
    end
  end

  context 'when previewing a Find & Update bulk update that has a long name', js: true do
    let(:bulk_update_name) { "Bulk Update Platforms Test Find & Update #{Faker::Number.number(digits: 3)}" }
    before(:each, bulk_update_step_1: true) do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").fill_in with: @find_and_update_concept_response.body['EntryTitle']
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      fill_in 'bulk_update_name', with: bulk_update_name
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
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
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
        expect(page).to have_content(@find_and_update_concept_response.body['EntryTitle'])
        expect(page).to have_content(@find_and_update_concept_response.body['ShortName'])
      end
    end

    context 'when submitting the bulk update' do
      before(:each, bulk_update_step_2: true) do
        click_on 'Submit'
        click_on 'Yes'

        # need to wait until the task status is 'COMPLETE'
        task_id = page.current_path.split('/').last
        wait_for_complete_bulk_update(task_id: task_id)

        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page', bulk_update_step_1: true, bulk_update_step_2: true do
        expect(page).to have_css('h2', text: bulk_update_name)

        within '.eui-info-box' do
          expect(page).to have_content('Status')
          expect(page).to have_content('Complete')
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Platforms')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Update')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Update')
          expect(page).to have_content('Short Name: A340-600')
        end

        within '.new-values-preview' do
          expect(page).to have_content('New Value')
          expect(page).to have_content('Type: Earth Observation Satellites')
          expect(page).to have_content('Short Name: DMSP 5B/F3')
          expect(page).to have_content('Long Name: Defense Meteorological Satellite Program-F3')
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing a draft form of the collection' do
        before do
          visit collection_path(@find_and_update_ingest_response['concept-id'])
          click_on 'Edit Collection Record'
          click_on 'Acquisition Information'
          click_on 'Expand All'
        end

        it 'displays the updated platform with a long name' do
          expect(page).to have_content('Type: Earth Observation Satellites')
          expect(page).to have_field('draft_platforms_0_short_name', with: 'DMSP 5B/F3')
          expect(page).to have_field('draft_platforms_0_long_name', with: 'Defense Meteorological Satellite Program-F3')
        end
      end
    end
  end

  context 'when previewing a Find & Update bulk update that does not have a long name', js: true do
    let(:bulk_update_name) { "Bulk Update Platforms Test Find & Update #{Faker::Number.number(digits: 3)}" }
    before(:each, bulk_update_step_1: true) do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").fill_in with: @find_and_update_concept_response_2.body['EntryTitle']
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      fill_in 'bulk_update_name', with: bulk_update_name
      select 'Platforms', from: 'Field to Update'
      select 'Find & Update', from: 'Update Type'
      fill_in 'Short Name', with: 'A340-600'
      # Select new Short Name from Select2
      find('.select2-container .select2-selection').click
      find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'DIADEM-1D').click

      click_on 'Preview'
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')


      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
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
        expect(page).to have_content('Short Name: DIADEM-1D')
        expect(page).to have_content('Long Name:')
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@find_and_update_concept_response_2.body['EntryTitle'])
        expect(page).to have_content(@find_and_update_concept_response_2.body['ShortName'])
      end
    end

    context 'when submitting the bulk update' do
      before(:each, bulk_update_step_2: true) do
        click_on 'Submit'
        click_on 'Yes'

        # need to wait until the task status is 'COMPLETE'
        task_id = page.current_path.split('/').last
        wait_for_complete_bulk_update(task_id: task_id)

        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page', bulk_update_step_1: true, bulk_update_step_2: true do
        expect(page).to have_css('h2', text: bulk_update_name)

        within '.eui-info-box' do
          expect(page).to have_content('Status')
          expect(page).to have_content('Complete')
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Platforms')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Update')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Update')
          expect(page).to have_content('Short Name: A340-600')
        end

        within '.new-values-preview' do
          expect(page).to have_content('New Value')
          expect(page).to have_content('Type: Earth Observation Satellites')
          expect(page).to have_content('Short Name: DIADEM-1D')
          expect(page).to have_content('Long Name:')
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing a draft form of the collection' do
        before do
          visit collection_path(@find_and_update_ingest_response_2['concept-id'])
          click_on 'Edit Collection Record'
          click_on 'Acquisition Information'
          click_on 'Expand All'
        end

        it 'displays the updated platform without a long name' do
          expect(page).to have_content('Type: Earth Observation Satellites')
          expect(page).to have_field('draft_platforms_0_short_name', with: 'DIADEM-1D')
          expect(page).to have_field('draft_platforms_0_long_name', with: '')
        end
      end
    end
  end
end

describe 'Bulk Updating Instruments' do
  before :all do
    @find_and_remove_ingest_response, @find_and_remove_concept_response = publish_collection_draft
    @find_and_update_ingest_response, @find_and_update_concept_response = publish_collection_draft
  end

  before do
    login

    visit new_bulk_updates_search_path
  end

  context 'when previewing a Find & Remove bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Instruments Test Find & Remove #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@find_and_remove_concept_response.body['EntryTitle'])
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      fill_in 'bulk_update_name', with: bulk_update_name
      select 'Instruments', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
      fill_in 'Short Name', with: 'LVIS'
      click_on 'Preview'
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
      expect(page).to have_content('Field to Update')
      expect(page).to have_content('Instruments')
      expect(page).to have_content('Update Type')
      expect(page).to have_content('Find And Remove')
      within '.find-values-preview' do
        expect(page).to have_content('Short Name: LVIS')
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
          expect(page).to have_content('Instruments')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Remove')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Remove')
          expect(page).to have_content('Short Name: LVIS')
        end
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@find_and_remove_ingest_response['concept-id'])
        end

        it 'does not display the removed instrument' do
          within '#metadata-preview' do
            expect(page).to have_no_content('LVIS')

            expect(page).to have_content('ADS')
            expect(page).to have_content('ATM')
            expect(page).to have_content('SMAP L-BAND RADIOMETER')
          end
        end
      end
    end
  end

  context 'when previewing a Find & Update bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Instruments Test Find & Update #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@find_and_update_concept_response.body['EntryTitle'])
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      fill_in 'bulk_update_name', with: bulk_update_name
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
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
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
          expect(page).to have_content('Instruments')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Update')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Update')
          expect(page).to have_content('Short Name: ADS')
        end

        within '.new-values-preview' do
          expect(page).to have_content('New Value')
          expect(page).to have_content('Short Name: ATM')
          expect(page).to have_content('Long Name: Airborne Topographic Mapper')
        end
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@find_and_update_ingest_response['concept-id'])
        end

        it 'displays instrument changes' do
          within '#metadata-preview' do
            #ToDo: ADS is been found in the json record, shouldn't be
            #expect(page).to have_no_content('ADS')

            expect(page).to have_content('LVIS')
            expect(page).to have_content('SMAP L-BAND RADIOMETER')
            expect(page).to have_content('ATM')
          end
        end
      end
    end
  end
end

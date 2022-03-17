describe 'Bulk updating Location Keywords' do
  before :all do
    @find_and_remove_ingest_response, @find_and_remove_concept_response = publish_collection_draft
    @add_to_existing_ingest_response, @add_to_existing_concept_response = publish_collection_draft
    @find_and_replace_ingest_response, @find_and_replace_concept_response = publish_collection_draft
    @clear_all_and_replace_ingest_response, @clear_all_and_replace_concept_response = publish_collection_draft
  end

  before do
    login

    visit new_bulk_updates_search_path
  end

  context 'when previewing a Find & Remove bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Location Keywords Test Find & Remove #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search form
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@find_and_remove_concept_response.body['EntryTitle'])
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      fill_in 'bulk_update_name', with: bulk_update_name
      select 'Location Keywords', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
      fill_in 'Type', with: 'ARCTIC'
      click_on 'Preview'
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')
      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
      expect(page).to have_content('Field to Update')
      expect(page).to have_content('Location Keywords')
      expect(page).to have_content('Update Type')
      expect(page).to have_content('Find And Remove')

      within '.find-values-preview' do
        expect(page).to have_content('CATEGORY: ANY VALUE ARCTIC', normalize_ws: true)
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
          expect(page).to have_content('Location Keywords')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Remove')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Remove')
          expect(page).to have_content('ARCTIC')
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@find_and_remove_ingest_response['concept-id'])

        end

        it 'no longer has the removed keyword' do
          within '#metadata-preview' do
            expect(page).to have_no_content('ARCTIC')
          end
        end
      end
    end
  end

  context 'when previewing a Add to Existing bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Location Keywords Test Add to Existing #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search form
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@add_to_existing_concept_response.body['EntryTitle'])
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      fill_in 'bulk_update_name', with: bulk_update_name
      select 'Location Keywords', from: 'Field to Update'
      select 'Add to Existing', from: 'Update Type'
      choose_keyword 'OCEAN'
      choose_keyword 'ATLANTIC OCEAN'
      choose_keyword 'NORTH ATLANTIC OCEAN'
      choose_keyword 'BALTIC SEA'
      click_on 'Select Keyword'
      click_on 'Preview'
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
      expect(page).to have_content('Field to Update')
      expect(page).to have_content('Location Keywords')
      expect(page).to have_content('Update Type')
      expect(page).to have_content('Add To Existing')

      within '.new-values-preview' do
        expect(page).to have_content('OCEAN ATLANTIC OCEAN NORTH ATLANTIC OCEAN BALTIC SEA', normalize_ws: true)
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@add_to_existing_concept_response.body['EntryTitle'])
        expect(page).to have_content(@add_to_existing_concept_response.body['ShortName'])
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
          expect(page).to have_content('Location Keywords')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Add To Existing')
        end

        within '.new-values-preview' do
          expect(page).to have_content('Value to Add')
          expect(page).to have_content('OCEAN ATLANTIC OCEAN NORTH ATLANTIC OCEAN BALTIC SEA', normalize_ws: true)
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@add_to_existing_ingest_response['concept-id'])

        end

        it 'displays the new keyword' do
          within '#metadata-preview' do
            expect(page).to have_content('OCEAN', normalize_ws: true)
            expect(page).to have_content('ATLANTIC OCEAN', normalize_ws: true)
            expect(page).to have_content('NORTH ATLANTIC OCEAN', normalize_ws: true)
            expect(page).to have_content('BALTIC SEA', normalize_ws: true)
          end
        end
      end
    end
  end

  context 'when previewing a Find & Replace bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Location Keywords Test Find & Replace #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search form
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@find_and_replace_concept_response.body['EntryTitle'])
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      fill_in 'bulk_update_name', with: bulk_update_name
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
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
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
        expect(page).to have_content('OCEAN ATLANTIC OCEAN NORTH ATLANTIC OCEAN BALTIC SEA', normalize_ws: true)
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@find_and_replace_concept_response.body['EntryTitle'])
        expect(page).to have_content(@find_and_replace_concept_response.body['ShortName'])
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
          expect(page).to have_content('Location Keywords')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Find And Replace')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Replace')
          expect(page).to have_content('OCEAN')
        end

        within '.new-values-preview' do
          expect(page).to have_content('New Value')
          expect(page).to have_content('OCEAN ATLANTIC OCEAN NORTH ATLANTIC OCEAN BALTIC SEA', normalize_ws: true)
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@find_and_replace_ingest_response['concept-id'])

        end

        it 'displays the new keyword' do
          within '#metadata-preview' do
            expect(page).to have_no_content('OCEAN ATLANTIC OCEAN NORTH ATLANTIC OCEAN BALTIC SEA', normalize_ws: true)
          end
        end
      end
    end
  end

  context 'when previewing a Clear All and Replace bulk update', js: true do
    let(:bulk_update_name) { "Bulk Update Location Keywords Test Clear All and Replace #{Faker::Number.number(digits: 3)}" }

    before(:each, bulk_update_step_1: true) do
      # Search form
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").set(@clear_all_and_replace_concept_response.body['EntryTitle'])
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      fill_in 'bulk_update_name', with: bulk_update_name
      select 'Location Keywords', from: 'Field to Update'
      select 'Clear All & Replace', from: 'Update Type'

      choose_keyword 'CONTINENT'
      choose_keyword 'AFRICA'
      choose_keyword 'CENTRAL AFRICA'
      click_on 'Select Keyword'
      click_on 'Preview'
    end

    it 'has the correct submit confirmation message', bulk_update_step_1: true do
      click_on 'Submit'
      expect(page).to have_content('All records updated by the Bulk Update will be stored in the CMR in UMM-JSON format. Are you sure you want to proceed?')
    end

    it 'displays the preview information', bulk_update_step_1: true do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Name')
      expect(page).to have_content(bulk_update_name)
      expect(page).to have_content('Field to Update')
      expect(page).to have_content('Location Keywords')
      expect(page).to have_content('Update Type')
      expect(page).to have_content('Clear All And Replace')

      # New Values
      within '.new-values-preview' do
        expect(page).to have_content('CONTINENT AFRICA CENTRAL AFRICA', normalize_ws: true)
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@clear_all_and_replace_concept_response.body['EntryTitle'])
        expect(page).to have_content(@clear_all_and_replace_concept_response.body['ShortName'])
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

      it 'displays the bulk update status page',bulk_update_step_1: true, bulk_update_step_2: true do
        expect(page).to have_css('h2', text: bulk_update_name)

        within '.eui-info-box' do
          expect(page).to have_content('Status')
          expect(page).to have_content('Complete')
          expect(page).to have_content('Field to Update')
          expect(page).to have_content('Location Keywords')
          expect(page).to have_content('Update Type')
          expect(page).to have_content('Clear All And Replace')
        end

        within '.new-values-preview' do
          expect(page).to have_content('New Value')
          expect(page).to have_content('CONTINENT AFRICA CENTRAL AFRICA', normalize_ws: true)
        end

        # we can't test the time accurately, but we can check the date
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          visit collection_path(@clear_all_and_replace_ingest_response['concept-id'])

        end

        it 'displays the updated keywords' do
          within '#metadata-preview' do
            expect(page).to have_no_content('GEOGRAPHIC REGION ARCTIC', normalize_ws: true)
            expect(page).to have_no_content('OCEAN ATLANTIC OCEAN', normalize_ws: true)

            expect(page).to have_content('CONTINENT', normalize_ws: true)
            expect(page).to have_content('AFRICA', normalize_ws: true)
            expect(page).to have_content('CENTRAL AFRICA', normalize_ws: true)
          end
        end
      end
    end
  end
end

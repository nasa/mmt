require 'rails_helper'

describe 'Bulk updating Platforms' do
  before :all do
    _ingest_response, @find_and_remove_concept_response = publish_collection_draft
    _ingest_response, @find_and_update_concept_response = publish_collection_draft
  end

  before do
    login

    visit new_bulk_updates_search_path
  end

  context 'when previewing a Find & Remove bulk update', js: true do
    before do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      fill_in 'query_text', with: @find_and_remove_concept_response.body['EntryTitle']
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      select 'Platforms', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
      fill_in 'Short Name', with: 'SMAP'
      click_on 'Preview'
    end

    it 'displays the preview information' do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Field to Update Platforms')
      expect(page).to have_content('Update Type Find And Remove')
      within '.find-values-preview' do
        expect(page).to have_content('Short Name: SMAP')
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@find_and_remove_concept_response.body['EntryTitle'])
        expect(page).to have_content(@find_and_remove_concept_response.body['ShortName'])
      end
    end

    context 'when submitting the bulk update' do
      before do
        click_on 'Submit'

        # need to wait until the task status is 'COMPLETE'
        task_id = page.current_path.split('/').last
        wait_for_complete_bulk_update(task_id: task_id)

        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page' do
        within '.eui-info-box' do
          expect(page).to have_content('Status Complete')
          expect(page).to have_content('Field to Update Platforms')
          expect(page).to have_content('Update Type Find And Remove')
        end

        within '.find-values-preview' do
          expect(page).to have_content('Find Values to Remove')
          expect(page).to have_content('Short Name: SMAP')
        end
      end

      context 'when viewing the collection' do
        before do
          within '#bulk-update-status-table' do
            click_on @find_and_remove_concept_response.body['EntryTitle']
          end
        end

        it 'does not display the removed platform' do
          within '.platform-cards' do
            expect(page).to have_content('A340-600')
            expect(page).to have_content('Aircraft')

            expect(page).to have_no_content('SMAP')
            expect(page).to have_no_content('Earth Observation Satellites')
          end
        end
      end
    end
  end

  context 'when previewing a Find & Update bulk update', js: true do
    before do
      # Search collections
      select 'Entry Title', from: 'Search Field'
      fill_in 'query_text', with: @find_and_update_concept_response.body['EntryTitle']
      click_button 'Submit'

      # select search result
      check 'checkall'
      click_on 'Next'

      # Bulk Update form
      select 'Platforms', from: 'Field to Update'
      select 'Find & Update', from: 'Update Type'
      fill_in 'Short Name', with: 'A340-600'
      # Select new Short Name from Select2
      find('.select2-container .select2-selection').click
      find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'DMSP 5B/F3', match: :first).click

      click_on 'Preview'
    end

    it 'displays the preview information' do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Field to Update Platforms')
      expect(page).to have_content('Update Type Find And Update')

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
      before do
        click_on 'Submit'

        # need to wait until the task status is 'COMPLETE'
        task_id = page.current_path.split('/').last
        wait_for_complete_bulk_update(task_id: task_id)

        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page' do
        within '.eui-info-box' do
          expect(page).to have_content('Status Complete')
          expect(page).to have_content('Field to Update Platforms')
          expect(page).to have_content('Update Type Find And Update')
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
      end

      context 'when viewing the collection' do
        before do
          within '#bulk-update-status-table' do
            click_on @find_and_update_concept_response.body['EntryTitle']
          end
        end

        it 'does not display the removed platform' do
          within '.platform-cards' do
            expect(page).to have_no_content('A340-600')
            expect(page).to have_no_content('Aircraft')

            expect(page).to have_content('DMSP 5B/F3')
            expect(page).to have_content('SMAP')
            expect(page).to have_content('Earth Observation Satellites', count: 2)
          end
        end
      end
    end
  end
end

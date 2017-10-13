require 'rails_helper'

describe 'Bulk updating Platforms', reset_provider: true do
  before :all do
    _ingest_response, @find_and_remove_concept_response = publish_collection_draft
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

      # Bulk update form
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
            expect(page).to have_no_content('SMAP')
          end
        end
      end
    end
  end
end

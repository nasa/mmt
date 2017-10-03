require 'rails_helper'

describe 'Bulk updating Data Centers', reset_provider: true do
  before do
    login

    _ingest_response, @concept_response = publish_collection_draft

    visit new_bulk_updates_search_path
  end

  context 'when previewing a Find & Remove bulk update', js: true do
    before do
      # Search form
      select 'Entry Title', from: 'Search Field'
      fill_in 'query_text', with: @concept_response.body['EntryTitle']
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      select 'Data Centers', from: 'Field to Update'
      select 'Find & Remove', from: 'Update Type'
      fill_in 'Short Name', with: 'ESA/ED'
      click_on 'Preview'
    end

    it 'displays the preview information' do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Field to Update Data Centers')
      expect(page).to have_content('Update Type Find And Remove')
      within '.find-values-preview' do
        expect(page).to have_content('Short Name: ESA/ED')
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@concept_response.body['EntryTitle'])
        expect(page).to have_content(@concept_response.body['ShortName'])
      end
    end

    context 'when submitting the bulk update' do
      before do
        click_on 'Submit'
        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page' do
        within '.eui-info-box' do
          expect(page).to have_content('Status Complete')
          expect(page).to have_content('Field to Update Data Centers')
          expect(page).to have_content('Update Type Find And Remove')
        end
      end

      context 'when viewing the collection' do
        before do
          within '#bulk-update-status-table' do
            click_on @concept_response.body['EntryTitle']
          end
        end

        it 'no longer has the removed data center' do
          within '.data-centers-cards' do
            expect(page).to have_no_content('ESA/ED')
          end
        end
      end
    end
  end

  context 'when using Find & Update', js: true do
    before do
      # Search form
      select 'Entry Title', from: 'Search Field'
      fill_in 'query_text', with: @concept_response.body['EntryTitle']
      click_button 'Submit'

      # Select search results
      check 'checkall'
      click_on 'Next'

      # Bulk update form
      # Update AARHUS-HYDRO to DOI/USGS/CMG/WHSC
      select 'Data Centers', from: 'Field to Update'
      select 'Find & Update', from: 'Update Type'
      fill_in 'Short Name', with: 'AARHUS-HYDRO'
      # Select new Short Name from Select2
      find('.select2-container .select2-selection').click
      find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'DOI/USGS/CMG/WHSC').click

      click_on 'Preview'
    end

    it 'displays the preview information' do
      expect(page).to have_content('Preview of New MMT_2 Bulk Update')

      expect(page).to have_content('Field to Update Data Centers')
      expect(page).to have_content('Update Type Find And Update')
      # Find Values to Update
      within '.find-values-preview' do
        expect(page).to have_content('Short Name: AARHUS-HYDRO')
      end

      # New Values
      within '.new-values-preview' do
        expect(page).to have_content('Short Name: DOI/USGS/CMG/WHSC')
        expect(page).to have_content('Long Name: Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior')
      end

      within '.bulk-update-preview-table' do
        expect(page).to have_content(@concept_response.body['EntryTitle'])
        expect(page).to have_content(@concept_response.body['ShortName'])
      end
    end

    context 'when submitting the bulk update' do
      before do
        click_on 'Submit'
        # Reload the page, because CMR
        page.evaluate_script('window.location.reload()')
      end

      it 'displays the bulk update status page' do
        within '.eui-info-box' do
          expect(page).to have_content('Status Complete')
          expect(page).to have_content('Field to Update Data Centers')
          expect(page).to have_content('Update Type Find And Update')
        end
      end

      context 'when viewing the collection' do
        before do
          within '#bulk-update-status-table' do
            click_on @concept_response.body['EntryTitle']
          end
        end

        it 'displays the updated data center' do
          within '.data-centers-cards' do
            expect(page).to have_no_content('AARHUS-HYDRO')
            expect(page).to have_content('DOI/USGS/CMG/WHSC')
          end
        end
      end
    end
  end
end

describe 'Deleting Variable Collection Associations', js: true, reset_provider: true do
  before do
    login

    @variable_ingest_response, _concept_response = publish_variable_draft

    create_variable_collection_association(@variable_ingest_response['concept-id'], @ingest_response1['concept-id'])
  end

  before :all do
    @ingest_response1, _concept_response1 = publish_collection_draft(entry_title: 'MODIS-I Water Traveler')
  end

  context 'When viewing the associated collection page' do
    before do
      visit variable_collection_associations_path(@variable_ingest_response['concept-id'])
    end

    it 'shows the associated collection' do
      within '#collection-associations' do
        expect(page).to have_selector('tbody > tr', count: 1)

        within 'tbody tr:nth-child(1)' do
          expect(page).to have_content('MODIS-I Water Traveler')
        end
      end
    end

    context 'When submitting the form with 1 value selected' do
      before do
        find("input[value='#{@ingest_response1['concept-id']}']").set(true)

        click_link 'Delete Selected Association'
      end

      it 'displays an appropriate confirmation message' do
        expect(page).to have_content('Are you sure you want to delete the selected collection association')
      end

      context 'When clicking Yes on the confirmation dialog' do
        before do
          click_on 'Yes'
        end

        it 'removes the association' do
          expect(page).to have_content('Collection Association Deleted Successfully!')
        end

        context 'When clicking the refresh link' do
          before do
            wait_for_cmr

            click_link 'refresh the page'
          end

          it 'reloads the page and displays no associations' do
            within '#collection-associations' do
              expect(page).to have_selector('tbody > tr', count: 1)
              expect(page).to have_content('No Collection Association found.')

              expect(page).to have_no_content('MODIS-I Water Skipper')
              expect(page).to have_no_content('MODIS-I Water Traveler')
            end
          end
        end
      end
    end
  end
end

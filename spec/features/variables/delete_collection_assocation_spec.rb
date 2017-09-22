require 'rails_helper'

describe 'Deleting Variable Collection Associations', js: true, reset_provider: true do
  before do
    login

    @variable_ingest_response, _concept_response = publish_variable_draft

    create_variable_collection_association(@variable_ingest_response['concept-id'], @ingest_response1['concept-id'], @ingest_response2['concept-id'])
  end

  before :all do
    @ingest_response1, _concept_response1 = publish_collection_draft(entry_title: 'MODIS-I Water Traveler')
    @ingest_response2, _concept_response2 = publish_collection_draft(entry_title: 'MODIS-I Water Skipper')
  end

  context 'When viewing the associated collections page' do
    before do
      visit variable_collection_associations_path(@variable_ingest_response['concept-id'])
    end

    it 'shows the associated collections' do
      within '#collection-associations' do
        expect(page).to have_selector('tbody > tr', count: 2)

        within 'tbody tr:nth-child(1)' do
          expect(page).to have_content('MODIS-I Water Skipper')
        end
        within 'tbody tr:nth-child(2)' do
          expect(page).to have_content('MODIS-I Water Traveler')
        end
      end
    end

    context 'When submitting the form with 1 value selected' do
      before do
        find("input[value='#{@ingest_response1['concept-id']}']").set(true)

        click_link 'Delete Selected Associations'
      end

      it 'displays an appropriate confirmation message' do
        expect(page).to have_content('Are you sure you want to delete the selected collection associations')
      end

      context 'When clicking Yes on the confirmation dialog' do
        before do
          click_on 'Yes'
        end

        it 'removes the association' do
          expect(page).to have_content('Collection Associations successfully deleted.')
        end

        context 'When clicking the refresh link' do
          before do
            wait_for_cmr

            click_link 'refresh the page'
          end

          it 'reloades the page and dislay the correct associations' do
            within '#collection-associations' do
              expect(page).to have_selector('tbody > tr', count: 1)

              within 'tbody tr:nth-child(1)' do
                expect(page).to have_content('MODIS-I Water Skipper')
              end
            end
          end
        end
      end
    end
  end
end

# MMT-562

require 'rails_helper'

describe 'Viewing Data Quality Summary Assignments', js: true do
  context 'when viewing the data quality summary assignments page' do
    before do
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

      login

      User.first.update(provider_id: 'MMT_2')

      visit data_quality_summary_assignments_path
    end

    it 'displays the data quality summary assignments form' do
      expect(page).to have_content('MMT_2 Data Quality Summary Assignments')

      # We mocked the CMR above so we know how many collections to expect
      expect(page).to have_selector('#catalog_item_guid_fromList option', count: 6)
    end

    context 'when clicking the display selected assignments button', js: true do
      context ' with no collections selected', js: true do
        before do
          click_on 'Display Assignments'
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('You must select at least 1 collection.')
        end
      end

      context 'with collections selected' do
        before do
          within '#catalog_item_guid_fromList' do
            # Mark's Test
            find('option[value="C1200060160-MMT_2"]').select_option

            # Matthew's Test
            find('option[value="C1200019403-MMT_2"]').select_option
          end

          within '.button-container' do
            find('.add_button').click
          end
        end

        context 'when the collections have no assignemnts' do
          before do
            VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/empty', record: :none) do
              click_on 'Display Assignments'
            end
          end

          it 'displays no results message' do
            expect(page).to have_content('No assignments found for the selected collections.')
          end
        end

        context 'when collections have assignments' do
          before do
            within '#catalog_item_guid_fromList' do
              # Mark's Test
              find('option[value="C1200060160-MMT_2"]').select_option

              # Matthew's Test
              find('option[value="C1200019403-MMT_2"]').select_option
            end

            within '.button-container' do
              find('.add_button').click
            end

            VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/list', record: :none) do
              click_on 'Display Assignments'
            end
          end

          it 'displays the correct list of assignments' do
            expect(page).to have_selector('#assignment-collections tbody tr', count: 2)
          end
        end
      end
    end
  end
end

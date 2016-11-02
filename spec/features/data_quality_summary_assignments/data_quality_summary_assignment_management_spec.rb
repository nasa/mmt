# MMT-562

require 'rails_helper'

describe 'Viewing Data Quality Summary Assignments', js: true do
  context 'when viewing the data quality summary assignments page' do
    before do
      login

      click_on 'Manage CMR'

      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

      click_on 'View Summary Assignments'
    end

    it 'displays the display data quality summary assignments form' do
      expect(page).to have_content('MMT_2 Data Quality Summary Assignments')

      # We mocked the CMR above so we know how many collectiosn to expect
      expect(page).to have_selector("input[name='catalog_item_guid[]']", count: 6)
    end

    context 'when clicking the display selected assignments button with no collections selected' do
      before do
        click_on 'Display Selected Assignments'
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('You must select at least 1 collection.')
      end
    end

    context 'when clicking the display selected assignments button with collections selected' do
      before do
        # Mark's Test
        check 'catalog_item_guid_C1200060160-MMT_2'

        # Matthew's Test
        check 'catalog_item_guid_C1200019403-MMT_2'

        VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/empty', record: :none) do
          click_on 'Display Selected Assignments'
        end
      end

      it 'displays no results message' do
        expect(page).to have_content('No assignments found for the selected collections.')
      end

      context 'when submitting an invalid data quality summary assignment form ' do
        before do
          VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/create', record: :none) do
            click_on 'Create New Assignments'
          end

          click_on 'Submit'
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('Data Quality Summary is required.')
          expect(page).to have_content('You must select at least 1 collection.')
        end

        context 'when submitting a valid data quality summary assignment form' do
          before do
            select 'DQS #1', from: 'definition_guid'

            # Mark's Test
            check 'catalog_item_guid_C1200060160-MMT_2'

            # Matthew's Test
            check 'catalog_item_guid_C1200019403-MMT_2'

            VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/created', record: :none) do
              click_on 'Submit'
            end
          end

          it 'displays validation errors within the form' do
            expect(page).to have_content('2 data quality summary assignments created successfully, 0 data quality summary assignments failed to save.')
          end

          context 'when clicking the display selected assignments button with collections selected' do
            before do
              # Mark's Test
              check 'catalog_item_guid_C1200060160-MMT_2'

              # Matthew's Test
              check 'catalog_item_guid_C1200019403-MMT_2'

              VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/list', record: :none) do
                click_on 'Display Selected Assignments'
              end
            end

            it 'displays no results message' do
              expect(page).to have_selector('#assignment-list tbody tr', count: 2)
            end

            context 'when clicking delete without any assignments selected' do
              before do
                click_on 'Delete Selected Assignments'
              end

              it 'display a validation message' do
                expect(page).to have_content('You must select at least 1 assignment.')
              end
            end

            context 'when selecting an assignment to delete' do
              before do
                within '#assignment-list' do
                  first("td input[type='checkbox']").set(true)
                end

                VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/delete', record: :none) do
                  click_on 'Delete Selected Assignments'
                end
              end

              it 'deletes the selected assignment' do
                expect(page).to have_content('1 data quality summary assignment deleted successfully, 0 data quality summary assignments failed to delete.')
              end
            end
          end
        end
      end
    end
  end
end

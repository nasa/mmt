# MMT-562

require 'rails_helper'

describe 'Viewing Data Quality Summary Assignments', js: true do
  context 'when viewing the data quality summary assignments page' do
    before do
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

      login

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

          context 'when asking to display collections with no assignments' do
            before do
              check 'Include selected collections with no assigned summaries?'
            end

            it 'displays the requested collections' do
              expect(page).to have_selector('#assignment-collections tbody tr', count: 3)
            end
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

          context 'When clicking on the Collection column' do
            before do
              find('#assignment-collections thead th:nth-child(2)').click
            end

            it 'It sorts the table by Collections in ascending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(2)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(2)')
              expect(first_cell).to have_content "Mark's Test"
              expect(last_cell).to have_content "Matthew's Test"
            end
          end

          context 'When clicking again on the Collection column' do
            before do
              find('#assignment-collections thead th:nth-child(2)').click
              find('#assignment-collections thead th:nth-child(2)').click
            end

            it 'It sorts the table by Collections in descending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(2)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(2)')
              expect(first_cell).to have_content "Matthew's Test"
              expect(last_cell).to have_content "Mark's Test"
            end
          end

          context 'When clicking on the Short Name column' do
            before do
              find('#assignment-collections thead th:nth-child(3)').click
            end

            it 'It sorts the table by Short Name in ascending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(3)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(3)')
              expect(first_cell).to have_content 'ID'
              expect(last_cell).to have_content "Matthew'sTest"
            end
          end

          context 'When clicking again on the Short Name column' do
            before do
              find('#assignment-collections thead th:nth-child(3)').click
              find('#assignment-collections thead th:nth-child(3)').click
            end

            it 'It sorts the table by Short Name in descending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(3)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(3)')
              expect(first_cell).to have_content "Matthew'sTest"
              expect(last_cell).to have_content 'ID'
            end
          end

          context 'When clicking on the Version ID column' do
            before do
              find('#assignment-collections thead th:nth-child(4)').click
            end

            it 'It sorts the table by Version ID in ascending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(4)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(4)')
              expect(first_cell).to have_content '1'
              expect(last_cell).to have_content '2'
            end
          end

          context 'When clicking again on the Version ID column' do
            before do
              find('#assignment-collections thead th:nth-child(4)').click
              find('#assignment-collections thead th:nth-child(4)').click
            end

            it 'It sorts the table by Version ID in descending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(4)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(4)')
              expect(first_cell).to have_content '2'
              expect(last_cell).to have_content '1'
            end
          end

          context 'When clicking on the Data Quality Summary column' do
            before do
              find('#assignment-collections thead th:nth-child(5)').click
            end

            it 'It sorts the table by Data Quality Summary in ascending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(5)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(5)')
              expect(first_cell).to have_content 'DQS #1'
              expect(last_cell).to have_content 'DQS #1'
            end
          end

          # This should be the same as the case above since these cells have the same content
          context 'When clicking again on the Data Quality Summary column' do
            before do
              find('#assignment-collections thead th:nth-child(5)').click
              find('#assignment-collections thead th:nth-child(5)').click
            end

            it 'It sorts the table by Data Quality Summary in descending order' do
              first_cell = find('#assignment-collections tbody tr:first-child td:nth-child(5)')
              last_cell = find('#assignment-collections tbody tr:last-child td:nth-child(5)')
              expect(first_cell).to have_content 'DQS #1'
              expect(last_cell).to have_content 'DQS #1'
            end
          end
        end
      end
    end
  end
end

describe 'Viewing Data Quality Summary Assignments', js: true do
  context 'when viewing the data quality summary assignments page' do
    before do
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/data_quality_summary_assignments/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

      login

      visit data_quality_summary_assignments_path
    end

    it 'displays the data quality summary assignments form' do
      expect(page).to have_content('MMT_2 Data Quality Summary Assignments')

      # We mocked the CMR above so we know how many collections to expect
      expect(page).to have_selector('#catalog_item_guid_fromList option', count: 6)
    end

    context 'when clicking the display selected assignments button' do
      context 'with no collections selected' do
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
            click_on 'Display Assignments'
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
              find('option[value="C1200189951-MMT_2"]').select_option

              # Matthew's Test
              find('option[value="C1200190013-MMT_2"]').select_option
            end

            within '.button-container' do
              find('.add_button').click
            end

            VCR.use_cassette("data_quality_summary_assignments/#{File.basename(__FILE__, '.rb')}_list_vcr", record: :none) do
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
              first_cell = find('#assignment-collections > tbody > tr:nth-child(3) > td:nth-child(2) > a')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(4) > td:nth-child(2) > a')
              expect(first_cell).to have_content "Test test title 03"
              expect(last_cell).to have_content "Testy long entry title"
            end
          end

          context 'When clicking again on the Collection column' do
            before do
              find('#assignment-collections thead th:nth-child(2)').click
              find('#assignment-collections thead th:nth-child(2)').click
            end

            it 'It sorts the table by Collections in descending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(1) > td:nth-child(2) > a')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(2) > td:nth-child(2) > a')
              expect(first_cell).to have_content "Testy long entry title"
              expect(last_cell).to have_content "Test test title 03"
            end
          end

          context 'When clicking on the Short Name column' do
            before do
              find('#assignment-collections thead th:nth-child(3)').click
            end

            it 'It sorts the table by Short Name in ascending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(3) > td:nth-child(3)')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(4) > td:nth-child(3)')
              expect(first_cell).to have_content 'New Testy Test'
              expect(last_cell).to have_content "testing 03"
            end
          end

          context 'When clicking again on the Short Name column' do
            before do
              find('#assignment-collections thead th:nth-child(3)').click
              find('#assignment-collections thead th:nth-child(3)').click
            end

            it 'It sorts the table by Short Name in descending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(1) > td:nth-child(3)')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(2) > td:nth-child(3)')
              expect(first_cell).to have_content "testing 03"
              expect(last_cell).to have_content 'New Testy Test'
            end
          end

          context 'When clicking on the Version ID column' do
            before do
              find('#assignment-collections thead th:nth-child(4)').click
            end

            it 'It sorts the table by Version ID in ascending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(1) > td:nth-child(4)')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(2) > td:nth-child(4)')
              expect(first_cell).to have_content '002'
              expect(last_cell).to have_content '02'
            end
          end

          context 'When clicking again on the Version ID column' do
            before do
              find('#assignment-collections thead th:nth-child(4)').click
              find('#assignment-collections thead th:nth-child(4)').click
            end

            it 'It sorts the table by Version ID in descending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(3) > td:nth-child(4)')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(4) > td:nth-child(4)')
              expect(first_cell).to have_content '02'
              expect(last_cell).to have_content '002'
            end
          end

          context 'When clicking on the Data Quality Summary column' do
            before do
              find('#assignment-collections thead th:nth-child(5)').click
            end

            it 'It sorts the table by Data Quality Summary in ascending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(3) > td:nth-child(5) > a')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(4) > td:nth-child(5) > a')
              expect(first_cell).to have_content 'data-quality-summary-name-v1'
              expect(last_cell).to have_content 'data-quality-summary-name-v22'
            end
          end

          # This should be the same as the case above since these cells have the same content
          context 'When clicking again on the Data Quality Summary column' do
            before do
              find('#assignment-collections thead th:nth-child(5)').click
              find('#assignment-collections thead th:nth-child(5)').click
            end

            it 'It sorts the table by Data Quality Summary in descending order' do
              first_cell = find('#assignment-collections > tbody > tr:nth-child(1) > td:nth-child(5) > a')
              last_cell = find('#assignment-collections > tbody > tr:nth-child(2) > td:nth-child(5) > a')
              expect(first_cell).to have_content 'data-quality-summary-name-v22'
              expect(last_cell).to have_content 'data-quality-summary-name-v1'
            end
          end
        end
      end
    end
  end
end

describe 'Deleting a Data Quality Summary Assignment', js: true do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/data_quality_summary_assignments/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login

    visit data_quality_summary_assignments_path

    wait_for_jQuery

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

  context 'when clicking delete with assignments selected' do
    before do
      within '#assignment-collections' do
        first("td input[type='checkbox']").set(true)
      end

      click_on 'Delete Selected Assignments'
    end

    it 'displays a confirmation dialog' do
      expect(page).to have_content('Are you sure you want to delete the data quality summary assignments for the selected collections?')
    end

    context 'When declining the confirmation dialog', js: true do
      before do
        click_on 'No'
      end

      it 'Closes the dialog and does not delete the order option assignments' do
        expect(page).to have_content('MMT_2 Data Quality Summary Assignments')
      end
    end

    context 'When accepting the confirmation dialog', js: true do
      before do
        VCR.use_cassette("data_quality_summary_assignments/#{File.basename(__FILE__, '.rb')}_delete_vcr", record: :none) do
          click_on 'Yes'
        end
      end

      it 'deletes the selected assignment' do
        expect(page).to have_content('Deleted 1 data quality summary assignment successfully.')
      end
    end
  end
end

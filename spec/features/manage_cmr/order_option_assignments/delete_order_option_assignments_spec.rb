describe 'Deleting Order Option Assignments', js: true do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/order_option_assignments/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
    login
    visit order_option_assignments_path
    wait_for_jQuery

    within '#collectionsChooser' do
      select('lorem_223 | ipsum', from: 'Available Collections')

      within '.button-container' do
        find('.add_button').click
      end
    end

    selected_collection_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/order_option_assignments/cmr_search_selected.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(selected_collection_response)
    VCR.use_cassette("order_option_assignments/create_order_option_assignments_spec_vcr", record: :none) do
      click_on 'Display Assignments'
    end
  end

  context 'When successfully deleting all option assignments for a selected collection' do
    before do
      find('#collections-table tbody tr:first-child td:first-child input[type=checkbox]').click
      click_on 'Delete Selected Assignments'
    end

    it 'Asks for confirmation before deleting' do
      expect(page).to have_content('Are you sure you want to delete the order option assignments for the selected collections?')
    end

    context 'When declining the confirmation dialog' do
      before do
        click_on 'No'
      end

      it 'Closes the dialog and does not delete the order option assignments' do
        expect(page).to have_content('Option Assignments')
      end
    end

    context 'When accepting the confirmation dialog' do
      before do
        VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_yes_vcr", record: :none) do
          click_on 'Yes'
        end
      end

      it 'Displays a success message and navigates to the Option Assignment Search page.' do
        expect(page).to have_content('Deleted 1 order option assignment successfully.')
        expect(page).to have_content('MMT_2 Order Option Assignments')
      end
    end
  end
end

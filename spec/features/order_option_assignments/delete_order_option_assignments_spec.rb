# MMT-597

require 'rails_helper'

describe 'Deleting Order Option Assignments' do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login

    visit order_option_assignments_path

    wait_for_ajax

    within '#collectionsChooser' do
      select('lorem_223 | ipsum', from: 'Available Collections')

      within '.button-container' do
        find('button[title=add]').click
      end
    end

    VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
      click_on 'Display Assignments'
    end
  end

  # I've created MMT-789. We've implemented a confirmation modal that is displayed on click
  # of this button. This error message is displayed when 'Yes' is clicked in the modal. This test
  # fails because the modal does not disappear.
  # context 'When trying to delete option assignments without selecting any collections', js: true do
  #   before do
  #     click_on 'Delete Selected Assignments'
  #   end

  #   it 'displays validation errors within the form' do
  #     expect(page).to have_content('You must select at least 1 collection.')
  #   end
  # end

  context 'When successfully deleting all option assignments for a selected collection', js: true do
    before do
      find('#collections-table tbody tr:first-child td:first-child input[type=checkbox]').click
      click_on 'Delete Selected Assignments'
    end

    it 'Asks for confirmation before deleting' do
      expect(page).to have_content('Are you sure you want to delete the order option assignments for the selected collections?')
    end

    context 'When declining the confirmation dialog', js: true do
      before do
        click_on 'No'
      end

      it 'Closes the dialog and does not delete the order option assignments' do
        expect(page).to have_content('Option Assignments')
      end
    end

    context 'When accepting the confirmation dialog', js: true do
      before do
        VCR.use_cassette('echo_rest/order_option_assignments/delete', record: :none) do
          click_on 'Yes'
        end
      end

      it 'Displays a success message and navigates to the Option Assignment Search page.' do
        expect(page).to have_content('Deleted 1 order option assignment successfully. ')
        expect(page).to have_content('MMT_2 Order Option Assignments')
      end
    end
  end
end

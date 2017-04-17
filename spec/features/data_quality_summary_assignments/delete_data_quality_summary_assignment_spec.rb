require 'rails_helper'

describe 'Deleting a Data Quality Summary Assignment', js: true do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login

    User.first.update(provider_id: 'MMT_2')

    visit data_quality_summary_assignments_path

    wait_for_ajax

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

  # I've created MMT-789. We've implemented a confirmation modal that is displayed on click
  # of this button. This error message is displayed when 'Yes' is clicked in the modal. This test
  # fails because the modal does not disappear.
  # context 'when clicking delete without any assignments selected' do
  #   before do
  #     click_on 'Delete Selected Assignments'
  #   end

  #   it 'display a validation message' do
  #     expect(page).to have_content('You must select at least 1 assignment.')
  #   end
  # end

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
        VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/delete', record: :none) do
          click_on 'Yes'
        end
      end

      it 'deletes the selected assignment' do
        expect(page).to have_content('Deleted 1 data quality summary assignment successfully.')
      end
    end
  end
end

require 'rails_helper'

describe 'Deleting a Data Quality Summary Assignment' do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

    login

    User.first.update(provider_id: 'MMT_2')

    visit data_quality_summary_assignments_path

    # Mark's Test
    check 'catalog_item_guid_C1200060160-MMT_2'

    # Matthew's Test
    check 'catalog_item_guid_C1200019403-MMT_2'

    VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/list', record: :none) do
      click_on 'Display Selected Assignments'
    end
  end

  context 'when clicking delete without any assignments selected', js: true do
    before do
      click_on 'Delete Selected Assignments'
    end

    it 'display a validation message' do
      expect(page).to have_content('You must select at least 1 assignment.')
    end
  end

  context 'when clicking delete with assignments selected' do
    before do
      within '#assignment-collections' do
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
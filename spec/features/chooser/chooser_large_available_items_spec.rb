require 'rails_helper'

describe 'Chooser Large Available Items', js: true do
  before do
    collections_response = cmr_success_response(build_large_json_response(500))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when viewing the chooser with 500+ collections available' do
    before do
      VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/create', record: :none) do
        visit new_data_quality_summary_assignments_path
      end
    end

    it 'displays the first 500 collections' do
      within '.from-container' do
        expect(page).to have_css('option', count: 500)
        expect(page).to have_content('Showing 500 of 500 items')
      end
    end
  end
end
